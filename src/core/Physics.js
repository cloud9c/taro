import { Quaternion, Vector3, Matrix4 } from '../lib/three.module.js';
import { World } from '../lib/cannon.js';

const _v1 = new Vector3();
const _v2 = new Vector3();
const _q1 = new Quaternion();
const _m1 = new Matrix4();
const SLEEPING = 2;

export class Physics extends World {

	constructor( parameters ) {

		super( parameters );
		this.epsilon = parameters.epsilon !== undefined ? parameters.epsilon : 0.001;
		this.gravity = parameters.gravity !== undefined ? parameters.gravity : new Vector3( 0, - 9.80665, 0 );
		this.rigidbodies = [];

	}

	_updateScene( scene ) {

		// remove old bodies and constraints
		for ( let i = this.bodies.length - 1; i >= 0; i -- )
			this.removeBody( this.bodies[ i ] );

		for ( let i = this.constraints.length - 1; i >= 0; i -- )
			this.removeConstraint( this.constraints[ i ] );

		// add new bodies and constraints
		this.rigidbodies = scene.components.rigidbody;

		for ( let i = 0, len = this.rigidbodies.length; i < len; i ++ )
			this.addBody( this.rigidbodies[ i ].ref );

		const constraints = scene.components.constraints;

		if ( constraints !== undefined ) {

			for ( let i = 0, len = bodies.length; i < len; i ++ )
				this.addConstraint( constraints[ i ].ref );

		}

	}

	update( fixedTimestep, deltaTime ) {

		const rigidbodies = this.rigidbodies;
		const constraints = this.constraints;

		for ( let i = 0, len = rigidbodies.length; i < len; i ++ ) {

			const entity = rigidbodies[ i ].entity;
			const body = rigidbodies[ i ].ref;

			entity.updateWorldMatrix( true, false );
			entity.matrixWorld.decompose( _v1, _q1, _v2 );

			let needsUpdate = false;

			if ( this.hasVectorChanged( body.interpolatedPosition, _v1 ) ) {

				body.position.copy( _v1 );
				body.previousPosition.copy( _v1 );
				body.interpolatedPosition.copy( _v1 );
				needsUpdate = true;

			}

			if ( this.hasQuaternionChanged( body.interpolatedQuaternion, _q1 ) ) {

				body.quaternion.copy( _q1 );
				body.previousQuaternion.copy( _q1 );
				body.interpolatedQuaternion.copy( _q1 );
				needsUpdate = true;

			}

			if ( needsUpdate ) {

				body.wakeUp();

				for ( let i = 0, len = constraints.length; i < len; i ++ )
					if ( constraints[ i ].bodyA === body || constraints[ i ].bodyB === body )
						constraints[ i ].update();

			}

			if ( this.hasVectorChanged( rigidbodies[ i ].cachedScale, _v2 ) ) {

				rigidbodies[ i ].cachedScale.copy( _v2 );

				const shapes = entity.getComponents( 'shape' );

				for ( let i = 0, len = shapes.length; i < len; i ++ ) {

					shapes[ i ].updateScale( _v2 );

				}

				body.wakeUp();

			}

		}

		const beforeSteps = this.stepnumber;

		this.step( fixedTimestep, deltaTime );

		const steps = this.stepnumber - beforeSteps;

		if ( this.hasActiveBodies ) {

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

		return steps;

	}

	hasVectorChanged( v1, v2 ) {

		const e = this.epsilon;
		return ! ( Math.abs( v1.x - v2.x ) < e && Math.abs( v1.y - v2.y ) < e && Math.abs( v1.z - v2.z ) < e );

	}

	hasQuaternionChanged( q1, q2 ) {

		const e = this.epsilon;
		return ! ( Math.abs( q1.x - q2.x ) < e && Math.abs( q1.y - q2.y ) < e && Math.abs( q1.z - q2.z ) < e && Math.abs( q1.w - q2.w ) < e );

	}

}
