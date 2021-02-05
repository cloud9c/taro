import { Scene as TS } from '../lib/three.module.js';
import { World } from '../lib/cannon.js';

export class Scene extends TS {

	constructor() {

		super();

		this._cameras = [];
		this._containers = { rigidbody: [] };
		this.physicsWorld = new World( { allowSleep: true } );

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
