import { Group, MathUtils } from '../lib/three.module.js';
import { Scene } from './Scene.js';
import { Application } from './Application.js';
import { ComponentManager } from './ComponentManager.js';

export class Entity extends Group {

	constructor( name, scene ) {

		super();

		this.components = [];
		this.queue = [];
		this.tags = [];

		this._enabled = true;

		if ( name !== undefined ) {

			if ( name.isScene !== undefined ) {

				name.add( this );

			} else {

				this.name = name;

			}

		}

		this.addEventListener( 'sceneadd', this._emptyQueue );

		if ( scene !== undefined && scene.isScene !== undefined ) {

			scene.add( this );

		} else if ( Application.currentApp !== undefined && Application.currentApp.currentScene !== undefined ) {

			Application.currentApp.currentScene.add( this );

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

		if ( this.scene._containers[ type ] === undefined )
			this.scene._containers[ type ] = [];

		this.scene._containers[ type ].push( component );

		if ( component.init !== undefined )
			component.init( data );

		component.dispatchEvent( { type: 'enable' } );

	}

	getComponent( type ) {

		const components = this.components;
		for ( let i = 0, len = components.length; i < len; i ++ ) {

			if ( components[ i ].componentType === type ) return components[ i ];

		}

	}

	getComponents( type ) {

		const list = [];
		const components = this.components;

		for ( let i = 0, len = components.length; i < len; i ++ ) {

			if ( components[ i ].componentType === type ) list.push( components[ i ] );

		}

		return list;

	}

	addComponent( type, data = {} ) {

		const constructor = ComponentManager.components[ type ];
		const config = constructor.config;

		if ( config.multiple !== true && this.getComponent( type ) !== undefined )
			return console.warn( 'Entity: multiple attribute for ' + type + ' component is false/undefined' );

		if ( config.dependencies !== undefined ) {

			const dependencies = config.dependencies;
			for ( let i = 0, len = dependencies.length; i < len; i ++ )
				if ( this.getComponent( dependencies[ i ] ) === undefined )
					this.addComponent( dependencies[ i ] );

		}

		if ( config.schema !== undefined ) ComponentManager.sanitizeData( data, config.schema );

		const component = new constructor();

		component.entity = this;
		component.uuid = MathUtils.generateUUID();

		this.components.push( component );

		if ( this.scene !== undefined ) this._activateComponent( type, component, data );
		else this.queue.push( { type, component, data } );

		return component;

	}

	removeComponent( component ) {

		if ( component.enabled === true ) component.enabled = false;

		const components = this.components;
		components.splice( components.indexOf( component ), 1 );

		this.dispatchEvent( { type: 'remove' } );

	}

	add( object ) {

		super.add( ...arguments );
		this.scene._addToScene( object );
		return this;

	}

	remove( object ) {

		super.remove( ...arguments );
		this.scene._removeFromScene( object );
		return this;

	}

	get enabled() {

		return this._enabled;

	}

	set enabled( value ) {

		if ( value != this._enabled ) {

			if ( value && this.parent.isScene === undefined && ! this.parent._enabled )
				return console.warn( "TARO.Entity: Can't enable if an ancestor is disabled" );
			this._enabled = value;

			const components = this.components;
			for ( let i = 0, len = components.length; i < len; i ++ )
				components[ i ].enabled = value;

			const children = this.getEntities();
			for ( let i = 0, len = children.length; i < len; i ++ )
				children[ i ].enabled = value;

			this.dispatchEvent( { type: value ? 'enable' : 'disable' } );

		}

	}

	traverseEntities( callback ) {

		this.traverse( child => {

			if ( child.isEntity !== undefined )
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

		return this.getObjectById( id );

	}

	getEntityByName( name ) {

		let match;

		this.traverseEntities( ( child ) => {

			if ( child.name === name ) {

				match = child;

			}

		} );

		return match;

	}

	getEntityByTag( tag ) {

		const matches = [];
		this.traverseEntities( ( child ) => {

			if ( child.tags.includes( tag ) )
				matches.push( child );

		} );
		return matches;

	}

	getEntityByProperty( name, value ) {

		let match;

		this.traverseEntities( ( child ) => {

			if ( child[ name ] === value ) {

				match = child;

			}

		} );

		return match;

	}

	get app() {

		return this.scene.app;

	}

}

Entity.prototype.isEntity = true;
