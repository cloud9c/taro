import { Quaternion, Vector3, Matrix4 } from '../lib/three.js';

const _v1 = new Vector3();
const _q1 = new Quaternion();
const SLEEPING = 2;

export class Physics {

	constructor( parameters ) {

		this._gravity = parameters.gravity !== undefined ? parameters.gravity : new Vector3( 0, - 9.80665, 0 );
		this.world;
		this.rigidbodies;

	}
	get gravity() {

		return this._gravity;

	}
	set gravity( gravity ) {

		this.world.gravity.copy( gravity );
		this._gravity = gravity;

	}

	_updateScene( scene ) {

		this.world = scene.physicsWorld;
		this.world.gravity.copy( this._gravity );

		this.rigidbodies = scene._containers[ 'rigidbody' ];

	}

	update( fixedTimestep, deltaTime ) {

		const rigidbodies = this.rigidbodies;

		for ( let i = 0, len = rigidbodies.length; i < len; i ++ ) {

			const entity = rigidbodies[ i ].entity;
			const body = rigidbodies[ i ].ref;

			if ( entity.position.equals( body.position ) === false ) {

				body.position.copy( entity.position );

			}

			if ( entity.quaternion.equals( body.quaternion ) === false ) {

				body.quaternion.copy( entity.quaternion );

			}

			if ( entity.scale.equals( rigidbodies[ i ].cachedScale ) === false ) {

				rigidbodies[ i ].cachedScale.copy( entity.scale );

				const shapes = entity.getComponents( 'shape' );

				for ( let i = 0, len = shapes.length; i < len; i ++ ) {

					const data = shapes[ i ].data;
					shapes[ i ].enabled = false;
					shapes[ i ].init( data );
					shapes[ i ].enabled = true;

				}

			}

		}

		this.world.step( fixedTimestep, deltaTime );

		if ( this.world.hasActiveBodies ) {

			for ( let i = 0, len = rigidbodies.length; i < len; i ++ ) {

				const body = rigidbodies[ i ];
				if ( body.ref.sleepState !== SLEEPING ) {

					const entity = body.entity;

					const position = entity.position;
					position.copy( body.ref.position );

					const quaternion = entity.quaternion;
					quaternion.copy( body.ref.quaternion );

					if ( entity.parent !== entity.scene ) {

						entity.worldToLocal( position );
						quaternion.premultiply( entity.parent.getWorldQuaternion( _q1 ).inverse() );

					}

				}

			}

		}

	}

}
