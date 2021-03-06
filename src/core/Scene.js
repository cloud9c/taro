import { Scene as ThreeScene, AudioListener } from '../lib/three.module.js';
import { App } from './App.js';

export class Scene extends ThreeScene {

	constructor( name, app ) {

		super();

		this.app = null;
		this.components = { rigidbody: [], camera: [] };

		this.audioListener = new AudioListener();

		if ( name !== undefined )
			this.name = name;

		if ( app !== false ) {

			if ( app !== undefined )
				app.addScene( this );
			else if ( App.currentApp !== undefined )
				App.currentApp.addScene( this );

		}


	}

	_addComponents( components, queue ) {

		for ( let i = 0, len = components.length; i < len; i ++ ) {

			const component = components[ i ];

			let inQueue = false;

			for ( let j = 0, lenj = queue.length; j < lenj; j ++ ) {

				if ( queue[ j ].component === component ) {

					inQueue = true;
					break;

				}

			}

			if ( inQueue ) continue;

			if ( component._enabled ) {

				const type = component.componentType;

				if ( this.components[ type ] === undefined )
					this.components[ type ] = [];

				this.components[ type ].push( component );

			}

		}

	}

	_removeComponents( components, queue ) {

		for ( let i = 0, len = components.length; i < len; i ++ ) {

			const component = components[ i ];

			let inQueue = false;

			for ( let j = 0, lenj = queue.length; j < lenj; j ++ ) {

				if ( queue[ j ].component === component ) {

					inQueue = true;
					break;

				}

			}

			if ( inQueue ) continue;

			if ( component._enabled ) {

				const type = component.componentType;
				const container = this.components[ type ];

				container.splice( container.indexOf( component ), 1 );

			}

		}

	}

	_addToScene( object ) {

		if ( object.isEntity !== undefined ) {

			if ( object.scene !== null ) {

				object.scene._removeFromScene( object );

			}

			this._addComponents( object.components, object.queue );

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

			this._removeComponents( object.components, object.queue );

			object.scene = null;
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
