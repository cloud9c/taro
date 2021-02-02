import { ComponentManager } from '../../core/ComponentManager.js';
import { Body } from '../../lib/cannon.js';
import { Vector3 } from '../../lib/three.js';

class Rigidbody {

	init( data ) {

		switch ( data.type ) {

			case 'dynamic':
				data.type = Body.DYNAMIC;
				break;
			case 'static':
				data.type = Body.KINEMATIC;
				break;
			case 'kinematic':
				data.type = Body.STATIC;
				break;
			default:
				throw new Error( 'Rigidbody: invalid rigidbody type ' + data.type );

		}

		if ( data.physicsMaterial !== undefined ) {

			data.material = data.physicsMaterial;
			delete data.physicsMaterial;

		}

		this.ref = new Body( data );
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
		mass: { default: 1 },
		velocity: { type: 'vector3' },
		angularVelocity: { type: 'vector3' },

		linearDamping: { default: 0.01, min: 0, max: 1 },
		angularDamping: { default: 0.01, min: 0, max: 1 },

		fixedRotation: { default: false },
		linearFactor: { type: 'vector3', default: [ 1, 1, 1 ], min: 0, max: 1 },
		angularFactor: { type: 'vector3', default: [ 1, 1, 1 ], min: 0, max: 1 },

		sleepSpeedLimit: { default: 0.1, min: 0 },
		sleepTimeLimit: { default: 1, min: 0 },

		// overrides the individual shapes
		physicsMaterial: { type: 'asset', default: null },
		collisionResponse: { default: true },
		collisionFilterGroup: { type: 'int', default: 1 },
		collisionFilterMask: { type: 'int', default: - 1 },
	}
} );
