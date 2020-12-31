import { Group } from "../lib/three.js";
import { Scene } from "./Scene.js";
import { Application } from "./Application.js";
import { ComponentManager } from "./ComponentManager.js";

export class Entity extends Group {

	constructor( name, scene ) {

		super();

		this.tags = [];

		this.isEntity = true;
		this._components = [];
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

		} else {

			Application.currentApp.scene.add( this );

		}

	}

	getComponent( type ) {

		const components = this._components;
		for ( let i = 0, len = components.length; i < len; i ++ ) {

			if ( components[ i ].componentType === type ) return components[ i ];

		}

	}

	getComponents( type ) {

		const list = [];
		const components = this._components;
		for ( let i = 0, len = components.length; i < len; i ++ ) {

			if ( components[ i ].componentType === type ) list.push( components[ i ] );

		}

		return list;

	}

	addComponent( type, data = {} ) {

		const options = ComponentManager._components[ type ].options;
		if (
			options.allowMultiple === false &&
			this.getComponent( type ) !== undefined
		) {

			return console.warn( "allowMultiple Attribute is false" );

		}

		if ( "requireComponents" in options ) {

			const required = options.requireComponents;
			for ( let i = 0, len = required.length; i < len; i ++ )
				if ( this.getComponent( required[ i ] ) === undefined )
					this.addComponent( required[ i ] );

		}

		const component = new ComponentManager._components[ type ].constructor();

		Object.defineProperty( component, "entity", {
			value: this,
		} );

		if ( ! ( type in this.scene._containers ) )
			this.scene._containers[ type ] = [];

		this.scene._containers[ type ].push( component );
		if ( "start" in component ) component.start( data );
		component.dispatchEvent( { type: "enable" } );

		this._components.push( component );

		return component;

	}

	add( obj ) {

		if ( obj instanceof Entity && obj.scene !== this.scene ) {

			this.scene.add( obj );

		}

		return super.add( obj );

	}

	remove( obj ) {

		if ( obj instanceof Entity ) {

			this.scene.add( obj );

		} else {

			super.remove( obj );

		}

		return obj;

	}

	destroy() {

		this.enabled = false;
		const children = this.getChildren();
		for ( let i = 0, len = children.length; i < len; i ++ )
			children[ i ].destroy();
		this.scene.remove( this );

	}

	get enabled() {

		return this._enabled;

	}

	set enabled( value ) {

		if ( value != this._enabled ) {

			if ( value && ! this.parent._enabled )
				return console.warn(
					"Entity: Can't enable if an ancestor is disabled"
				);
			this._enabled = value;

			const components = this._components;
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

	get app() {

		return this.scene.app;

	}

	toJSON( meta ) {

		const json = super.toJSON( meta );

		const object = json.object;

		object.isEntity = true;
		if ( this.tags.length !== 0 ) object.tags = this.tags;
		object.enabled = this._enabled;

		if ( this._components.length !== 0 ) {

			object.components = [];

			for ( let i = 0, len = this._components.length; i < len; i ++ ) {

				const component = this._components[ i ];

				if ( component.isObject3D || component.ref !== undefined && component.ref.isObject3D ) {

					continue;

				}

				const type = component.componentType;
				const meta = { type, data: {} };


				if ( "toJSON" in component ) {

					meta.data = component.toJSON();

				} else {

					meta.data = Object.assign( {}, component );
					delete meta.data._listeners;

				}

				meta.enabled = component._enabled;

				object.components.push( meta );

			}

			this._components;

		}

		return json;

	}

}
