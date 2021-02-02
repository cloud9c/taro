import { ComponentManager } from '../../core/ComponentManager.js';
import { Body } from '../../lib/cannon.js';
import { Vector3 } from '../../lib/three.js';

class Rigidbody {

	init( data ) {

		const newData = Object.assign( data );

		switch ( newData.type ) {

			case 'dynamic':
				newData.type = Body.DYNAMIC;
				break;
			case 'static':
				newData.type = Body.KINEMATIC;
				break;
			case 'kinematic':
				newData.type = Body.STATIC;
				break;
			default:
				throw new Error( 'Rigidbody: invalid rigidbody type ' + newData.type );

		}

		if ( newData.physicsMaterial !== undefined ) {

			newData.material = newData.physicsMaterial;
			delete newData.physicsMaterial;

		}

		this.ref = new Body( newData );
		this.cachedScale = new Vector3().copy( this.entity.scale );

		this.ref.addEventListener( 'collide', event => this.entity.dispatchEvent( event ) );
		this.ref.addEventListener( 'wakeup', event => this.entity.dispatchEvent( event ) );
		this.ref.addEventListener( 'sleepy', event => this.entity.dispatchEvent( event ) );
		this.ref.addEventListener( 'sleep', event => this.entity.dispatchEvent( event ) );

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.scene.physicsWorld.addBody( this.ref );

	}

	onDisable() {

		this.scene.physicsWorld.removeBody( this.ref );

	}

}

ComponentManager.register( 'rigidbody', Rigidbody, {
	schema: {
		type: { type: 'select', default: 'dynamic', select: [ 'dynamic', 'static', 'kinematic' ] },
		mass: { default: 1, if: { type: [ 'dynamic' ] } },
		velocity: { type: 'vector3', if: { type: [ 'dynamic', 'kinematic' ] } },
		angularVelocity: { type: 'vector3', if: { type: [ 'dynamic', 'kinematic' ] } },

		linearDamping: { default: 0.01, min: 0, max: 1, if: { type: [ 'dynamic', 'kinematic' ] } },
		angularDamping: { default: 0.01, min: 0, max: 1, if: { type: [ 'dynamic', 'kinematic' ] } },

		fixedRotation: { default: false, if: { type: [ 'dynamic', 'kinematic' ] } },
		linearFactor: { type: 'vector3', default: [ 1, 1, 1 ], min: 0, max: 1, if: { type: [ 'dynamic', 'kinematic' ] } },
		angularFactor: { type: 'vector3', default: [ 1, 1, 1 ], min: 0, max: 1, if: { type: [ 'dynamic', 'kinematic' ] } },

		sleepSpeedLimit: { default: 0.1, min: 0, if: { type: [ 'dynamic', 'kinematic' ] } },
		sleepTimeLimit: { default: 1, min: 0, if: { type: [ 'dynamic', 'kinematic' ] } },

		// overrides the individual shapes
		physicsMaterial: { type: 'asset', default: null },
		collisionResponse: { default: true },
		collisionFilterGroup: { type: 'int', default: 1 },
		collisionFilterMask: { type: 'int', default: - 1 },
	}
} );
