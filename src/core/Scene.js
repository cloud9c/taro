import { Scene as TS } from '../lib/three.js';
import { OIMO } from '../lib/oimo.js';

export class Scene extends TS {

	constructor() {

		super();

		this._cameras = [];
		this._containers = { rigidbody: [] };
		this._physicsWorld = new OIMO.World( 2 );

	}

	_addComponents( components ) {

		for ( let i = 0, len = components.length; i < len; i ++ ) {

			const component = components[ i ];
			if ( component._enabled ) {

				const type = component.componentType;

				if ( this._containers[ type ] === undefined )
					this._containers[ type ] = [];
				this._containers[ type ].push( component );

			}

		}

	}

	_removeComponents( components ) {

		for ( let i = 0, len = components.length; i < len; i ++ ) {

			const component = components[ i ];
			if ( component._enabled ) {

				const type = component.componentType;
				const container = this._containers[ type ];

				container.splice( container.indexOf( component ), 1 );

			}

		}

	}

	_addToScene( object ) {

		if ( object.isEntity !== undefined ) {

			this._addComponents( object.components );
			const oldScene = object.scene;
			object.scene = this;

			if ( oldScene === undefined ) {

				object.dispatchEvent( { type: 'sceneadd' } );
				object.traverseEntities( ( child ) => {

					child.scene = this;
					child.dispatchEvent( { type: 'sceneadd' } );

				} );

			}

		}

	}

	_removeFromScene( object ) {

		if ( object.isEntity !== undefined && this.children.indexOf( object ) !== - 1 ) {

			this._removeComponents( object.components );
			delete object.scene;

			object.dispatchEvent( { type: 'sceneremove' } );
			object.traverseEntities( ( child ) => {

				delete child.scene;
				child.dispatchEvent( { type: 'sceneremove' } );

			} );

		}

	}

	add( object ) {

		this._addToScene( object );

		return super.add( ...arguments );

	}

	remove( object ) {

		this._removeFromScene( object );

		return super.remove( ...arguments );

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

		this.traverse( ( child ) => {

			if ( child.isEntity !== undefined && child.name === name ) {

				match = child;

			}

		} );

		return match;

	}

	getEntityByTag( tag ) {

		const matches = [];
		this.traverse( ( child ) => {

			if ( child.isEntity !== undefined && child.tags.includes( tag ) )
				matches.push( child );

		} );
		return matches;

	}

	getEntityByProperty( name, value ) {

		let match;

		this.traverse( ( child ) => {

			if ( child.isEntity !== undefined && child[ name ] === value ) {

				match = child;

			}

		} );

		return match;

	}

}
