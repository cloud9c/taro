import { Group } from "../lib/three.js";
import { Scene } from "./Scene.js";
import { Application } from "./Application.js";
import { ComponentManager } from "./ComponentManager.js";

export class Entity extends Group {

	constructor( name, scene ) {

		super();

		this.tags = [];
		this.components = [];
		this._enabled = true;

		if ( name !== undefined ) {

			if ( name instanceof Scene ) {

				name.add( this );

			} else {

				this.name = name;

			}

		}

		if ( scene instanceof Scene ) {

			scene.add( this );

		} else if ( Application.currentApp !== undefined && Application.currentApp.currentScene !== undefined ) {

			Application.currentApp.currentScene.add( this );

		}

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

		const componentData = ComponentManager._components[ type ];
		const options = componentData.options;

		if (
			options.allowMultiple === false &&
		this.getComponent( type ) !== undefined
		) {

			return console.warn( "TARO.Entity: allowMultiple Attribute is false" );

		}

		if ( options.requireComponents !== undefined ) {

			const required = options.requireComponents;
			for ( let i = 0, len = required.length; i < len; i ++ )
				if ( this.getComponent( required[ i ] ) === undefined )
					this.addComponent( required[ i ] );

		}

		const component = new componentData.constructor();

		if ( this.scene !== undefined ) {

			if ( this.scene._containers[ type ] === undefined )
				this.scene._containers[ type ] = [];

			this.scene._containers[ type ].push( component );

		}

		this.components.push( component );

		Object.defineProperty( component, "entity", {
			value: this,
		} );

		if ( component.start !== undefined )
			component.start( data );

		component.dispatchEvent( { type: "enable" } );

		return type === "Renderable" ? component.ref : component;

	}

	removeComponent( component ) {

		if ( component.enabled ) {

			const type = component.componentType;
			const container = this.scene._containers[ type ];
			container.splice( container.indexOf( component ), 1 );

		}

		const components = this.entity.components;
		components.splice( components.indexOf( component ), 1 );

		this.dispatchEvent( { type: "disable" } );
		this.dispatchEvent( { type: "remove" } );

	}

	add( object ) {

		if ( object instanceof Entity && object.scene !== this.scene ) {

			this.scene._addComponents( object.components );

			entity.scene = this;

		}

		return super.add( object );

	}

	remove( object ) {

		if ( this.children.indexOf( object ) !== - 1 ) {

			if ( object instanceof Entity ) {

				this._disableEverything();

			}

			super.remove( object );

		}

		return this;

	}

	_disableEverything() {

		this.enabled = false;
		const components = this.getChildren();
		for ( let i = 0, len = components.length; i < len; i ++ )
			components[ i ].enabled = false;

	}

	get enabled() {

		return this._enabled;

	}

	set enabled( value ) {

		if ( value != this._enabled ) {

			if ( value && ! this.parent._enabled )
				return console.warn(
					"TARO.Entity: Can't enable if an ancestor is disabled"
				);
			this._enabled = value;

			const components = this.components;
			for ( let i = 0, len = components.length; i < len; i ++ )
				components[ i ].enabled = value;

			const children = this.getChildren();
			for ( let i = 0, len = children.length; i < len; i ++ )
				children[ i ].enabled = value;

			this.dispatchEvent( { type: value ? "enable" : "disable" } );

		}

	}

	getChildren() {

		const filteredChildren = [];
		const children = this.children;
		for ( let i = 0, len = children.length; i < len; i ++ ) {

			if ( children[ i ] instanceof Entity )
				filteredChildren.push( children[ i ] );

		}

		return filteredChildren;

	}

	find( name ) {

		return this.getObjectByName( name );

	}

	findByTag( tag ) {

		const matches = [];
		this.traverse( ( child ) => {

			if ( child instanceof Entity && child.tags.includes( tag ) ) {

				matches.push( child );

			}

		} );
		return matches;

	}

	findById( id ) {

		return this.getObjectById( id );

	}

	findByProperty( name, value ) {

		return this.getObjectByProperty( name, value );

	}

	get app() {

		return this.scene.app;

	}

	toJSON( meta ) {

		const data = super.toJSON( meta );

		const object = data.object;

		object.isEntity = true;
		if ( this.tags.length !== 0 ) object.tags = this.tags;
		object.enabled = this._enabled;

		if ( this.components.length !== 0 ) {

			object.components = [];

			for ( let i = 0, len = this.components.length; i < len; i ++ ) {

				const component = this.components[ i ];

				if ( component.isObject3D || component.ref !== undefined && component.ref.isObject3D ) {

					continue;

				}

				const type = component.componentType;
				const meta = { type, data: {} };


				if ( component.toJSON !== undefined ) {

					meta.data = component.toJSON();

				} else {

					meta.data = Object.assign( {}, component );
					delete meta.data._listeners;

				}

				meta.enabled = component._enabled;

				object.components.push( meta );

			}

			this.components;

		}

		return data;

	}

}
