import { Scene as TS } from '../lib/three.module.js';
import { Application } from './Application.js';
import { World } from '../lib/cannon.js';

export class Scene extends TS {

	constructor( name, app ) {

		super();

		this.components = { rigidbody: [], camera: [] };
		this.physicsWorld = new World( { allowSleep: true } );

		if ( name !== undefined )
			this.name = name;

		if ( app !== undefined )
			app.addScene( this );
		else if ( Application.currentApp !== undefined )
			Application.currentApp.addScene( this );


	}

	_addComponents( components ) {

		for ( let i = 0, len = components.length; i < len; i ++ ) {

			const component = components[ i ];
			if ( component._enabled ) {

				const type = component.componentType;

				if ( this.components[ type ] === undefined )
					this.components[ type ] = [];
				this.components[ type ].push( component );

			}

		}

	}

	_removeComponents( components ) {

		for ( let i = 0, len = components.length; i < len; i ++ ) {

			const component = components[ i ];
			if ( component._enabled ) {

				const type = component.componentType;
				const container = this.components[ type ];

				container.splice( container.indexOf( component ), 1 );

			}

		}

	}

	_addToScene( object ) {

		if ( object.isEntity !== undefined ) {

			if ( object.scene !== undefined ) {

				object.scene._removeComponents( object.components );

			}

			this._addComponents( object.components );

			object.scene = this;
			object.dispatchEvent( { type: 'sceneadd' } );

			const children = object.children;
			for ( let i = 0, len = children.length; i < len; i ++ ) {

				this._addToScene( children[ i ] );

			}

		}

	}

	_removeFromScene( object ) {

		if ( object.isEntity !== undefined ) {

			this._removeComponents( object.components );

			delete object.scene;
			object.dispatchEvent( { type: 'sceneremove' } );

			const children = object.children;
			for ( let i = 0, len = children.length; i < len; i ++ ) {

				this._removeFromScene( children[ i ] );

			}

		}

	}

	add( object ) {

		super.add( ...arguments );
		this._addToScene( object );
		return this;

	}

	remove( object ) {

		super.remove( ...arguments );
		this._removeFromScene( object );
		return this;

	}

	getComponent( type ) {

		return this.components[ type ] !== undefined ? this.components[ type ][ 0 ] : undefined;

	}

	getComponents( type ) {

		return this.components[ type ] !== undefined ? this.components[ type ] : [];

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

		return this.getEntityByProperty( 'id', id );

	}

	getEntityByName( name ) {

		return this.getEntityByProperty( 'name', name );

	}

	getEntityByTag( tag ) {

		const entities = this.getEntities();

		for ( let i = 0, l = entities.length; i < l; i ++ ) {

			const child = entities[ i ];
			const object = child.getEntityByTag( tag );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	}

	getEntityByProperty( name, value ) {

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

}
