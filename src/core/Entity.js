import { Group, MathUtils } from '../lib/three.module.js';
import { Scene } from './Scene.js';
import { App } from './App.js';
import { ComponentManager } from './ComponentManager.js';

export class Entity extends Group {

	constructor( name, parent ) {

		super();

		this.scene = null;

		this.castShadow = true;
		this.receiveShadow = true;

		this.components = [];
		this.queue = [];

		this._enabled = true;

		this.addEventListener( 'sceneadd', this._emptyQueue );

		if ( name !== undefined )
			this.name = name;

		if ( parent !== false ) {

			if ( parent !== undefined ) {

				parent.add( this );

			} else if ( App.currentApp !== undefined && App.currentApp.currentScene !== undefined ) {

				App.currentApp.currentScene.add( this );

			}

		}

	}

	_emptyQueue() {

		while ( this.queue.length > 0 ) {

			const object = this.queue[ 0 ];

			this._activateComponent( object.type, object.component, object.data );
			this.queue.shift();

		}


	}

	_activateComponent( type, component, data ) {

		if ( this.scene.components[ type ] === undefined )
			this.scene.components[ type ] = [];

		this.scene.components[ type ].push( component );

		if ( component.init !== undefined )
			component.init( data );

		if ( this.enabled ) component.dispatchEvent( { type: 'enable' } );

	}

	getComponent( type ) {

		const components = this.components;
		for ( let i = 0, len = components.length; i < len; i ++ )
			if ( components[ i ].componentType === type ) return components[ i ];

		return undefined;


	}

	getComponents( type ) {

		const array = [];
		const components = this.components;

		for ( let i = 0, len = components.length; i < len; i ++ )
			if ( components[ i ].componentType === type ) array.push( components[ i ] );

		return array;

	}

	addComponent( type, data = {} ) {

		const definition = ComponentManager.components[ type ];

		if ( definition === undefined ) return console.error( 'Entity: component does not exist' );

		const config = definition.config;

		if ( config.multiple !== true && this.getComponent( type ) !== undefined )
			return console.warn( 'Entity: multiple attribute for ' + type + ' component is false/undefined' );

		if ( config.dependencies !== undefined ) {

			const dependencies = config.dependencies;
			for ( let i = 0, len = dependencies.length; i < len; i ++ )
				if ( this.getComponent( dependencies[ i ] ) === undefined )
					this.addComponent( dependencies[ i ] );

		}

		if ( config.schema !== undefined ) ComponentManager.sanitizeData( data, config.schema );

		const component = new definition();
		component.entity = this;
		component.uuid = MathUtils.generateUUID();

		this.components.push( component );

		if ( this.scene !== null ) this._activateComponent( type, component, data );
		else this.queue.push( { type, component, data } );

		return component;

	}

	removeComponent( component ) {

		const index = this.components.indexOf( component );

		if ( index === - 1 ) return this;
		if ( component.enabled ) component.enabled = false;

		this.components.splice( index, 1 );
		this.dispatchEvent( { type: 'remove' } );

		return this;

	}

	add( object ) {

		super.add( ...arguments );
		if ( this.scene !== null ) this.scene._addToScene( object );

		return this;

	}

	remove( object ) {

		super.remove( ...arguments );
		if ( this.scene !== null ) this.scene._removeFromScene( object );

		return this;

	}

	get enabled() {

		const parent = this.parent;

		if ( parent !== null && parent.isEntity && ! parent.enabled )
			return false;

		return this._enabled;

	}

	set enabled( value ) {

		if ( value != this.enabled ) {

			if ( value && parent.isEntity && ! parent.enabled )
				return console.warn( 'Entity: Can\'t enable if an ancestor is disabled' );

			this.traverseEntities( entity => {

				const components = entity.components;

				if ( value ) {

					const temp = [];
					for ( let i = 0, len = components.length; i < len; i ++ ) {

						if ( components[ i ]._enabled ) {

							components[ i ]._enabled = false;
							temp.push( components[ i ] );

						}

					}

					entity._enabled = true;

					for ( let i = 0, len = temp.length; i < len; i ++ ) {

						components[ i ]._enabled = true;
						const container = entity.scene.components[ temp[ i ].componentType ];
						container.push( temp[ i ] );
						temp[ i ].dispatchEvent( { type: 'enable' } );

					}

				} else {

					const temp = [];
					for ( let i = 0, len = components.length; i < len; i ++ ) {

						if ( components[ i ]._enabled ) {

							temp.push( components[ i ] );
							components[ i ]._enabled = false;
							const container = entity.scene.components[ components[ i ].componentType ];
							container.splice( container.indexOf( components[ i ] ), 1 );
							components[ i ].dispatchEvent( { type: 'disable' } );

						}

					}

					entity._enabled = false;

					for ( let i = 0, len = temp.length; i < len; i ++ ) {

						temp[ i ]._enabled = true;

					}

				}

			} );

			this.dispatchEvent( { type: value ? 'enable' : 'disable' } );

		}

	}

	traverseEntities( callback ) {

		this.traverse( child => {

			if ( child.isEntity )
				callback( child );

		} );

	}

	getEntities() {

		const filteredChildren = [];
		const children = this.children;
		for ( let i = 0, len = children.length; i < len; i ++ ) {

			if ( children[ i ].isEntity !== undefined )
				filteredChildren.push( children[ i ] );

		}

		return filteredChildren;

	}

	getEntityById( id ) {

		return this.getEntityByProperty( 'id', id );

	}

	getEntityByName( name ) {

		return this.getEntityByProperty( 'name', name );

	}

	getEntityByProperty( name, value ) {

		if ( this[ name ] === value ) return this;

		const entities = this.getEntities();

		for ( let i = 0, l = entities.length; i < l; i ++ ) {

			const child = entities[ i ];
			const object = child.getEntityByProperty( name, value );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	}

	get app() {

		return this.scene.app;

	}

}

Entity.prototype.isEntity = true;
