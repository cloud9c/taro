import { Quaternion, Vector3, Matrix4 } from '../lib/three.module.js';

const _v1 = new Vector3();
const _v2 = new Vector3();
const _q1 = new Quaternion();
const _m1 = new Matrix4();
const SLEEPING = 2;

export class Physics {

	constructor( parameters ) {

		this._gravity = parameters.gravity !== undefined ? parameters.gravity : new Vector3( 0, - 9.80665, 0 );
		this.world = undefined;
		this.rigidbodies = undefined;

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

		this.rigidbodies = scene.components.rigidbody;

	}

	update( fixedTimestep, deltaTime ) {

		const rigidbodies = this.rigidbodies;

		for ( let i = 0, len = rigidbodies.length; i < len; i ++ ) {

			const entity = rigidbodies[ i ].entity;
			const body = rigidbodies[ i ].ref;

			entity.updateWorldMatrix( true, false );
			entity.matrixWorld.decompose( _v1, _q1, _v2 );

			if ( this.hasVectorChanged( body.interpolatedPosition, _v1 ) ) {

				body.position.copy( _v1 );
				body.previousPosition.copy( _v1 );
				body.interpolatedPosition.copy( _v1 );
				body.wakeUp();

			}

			if ( this.hasQuaternionChanged( body.interpolatedQuaternion, _q1 ) ) {

				body.quaternion.copy( _q1 );
				body.previousQuaternion.copy( _q1 );
				body.interpolatedQuaternion.copy( _q1 );
				body.wakeUp();

			}

			if ( this.hasVectorChanged( rigidbodies[ i ].cachedScale, _v2 ) ) {

				rigidbodies[ i ].cachedScale.copy( _v2 );

				const shapes = entity.getComponents( 'shape' );

				for ( let i = 0, len = shapes.length; i < len; i ++ ) {

					const data = shapes[ i ].data;
					shapes[ i ].enabled = false;
					shapes[ i ].init( data );
					shapes[ i ].enabled = true;

				}

				body.wakeUp();

			}

		}

		this.world.step( fixedTimestep, deltaTime );

		if ( this.world.hasActiveBodies ) {

			for ( let i = 0, len = rigidbodies.length; i < len; i ++ ) {

				const component = rigidbodies[ i ];
				const body = component.ref;

				if ( body.sleepState !== SLEEPING ) {

					const entity = component.entity;

					const position = entity.position;
					position.copy( body.interpolatedPosition );

					const quaternion = entity.quaternion;
					quaternion.copy( body.interpolatedQuaternion );

					if ( entity.parent.isEntity === true ) {

						entity.parent.updateWorldMatrix( true, false );

						position.applyMatrix4( _m1.copy( entity.parent.matrixWorld ).invert() );
						quaternion.premultiply( entity.parent.getWorldQuaternion( _q1 ).invert() );


					}

				}

			}

		}

	}

	hasVectorChanged( v1, v2 ) {

		return ! ( Math.abs( v1.x - v2.x ) < 0.001 &&
				 Math.abs( v1.y - v2.y ) < 0.001 &&
				 Math.abs( v1.z - v2.z ) < 0.001 );

	}

	hasQuaternionChanged( q1, q2 ) {

		return ! ( Math.abs( q1.x - q2.x ) < 0.001 &&
				 Math.abs( q1.y - q2.y ) < 0.001 &&
				 Math.abs( q1.z - q2.z ) < 0.001 &&
				 Math.abs( q1.w - q2.w ) < 0.001 );

	}

}
