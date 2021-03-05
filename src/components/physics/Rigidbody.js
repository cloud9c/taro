import { ComponentManager } from '../../core/ComponentManager.js';
import { Body, Material } from '../../lib/cannon-es.js';
import { Vector3, FileLoader } from '../../lib/three.module.js';

const types = [ 'dynamic', 'static', 'kinematic' ];
const indexedTypes = [ undefined, 'dynamic', 'static', undefined, 'kinematic' ];
const fileLoader = new FileLoader();
class Rigidbody {

	init( data ) {

		data.type = indexedTypes.indexOf( data.type );

		this.ref = new Body( data );
		this.cachedScale = this.entity.getWorldScale( new Vector3() );

		this.type = data.type = indexedTypes[ data.type ];

		if ( data.material.length > 0 ) {

			this.ref.material = this.app.assets.get( data.material );
			if ( this.ref.material === undefined )
				fileLoader.load( data.material, ( json ) => this.onMaterialLoad( data.material, json ) );

		}

		this.ref.addEventListener( 'collide', event => this.entity.dispatchEvent( event ) );
		this.ref.addEventListener( 'wakeup', event => this.entity.dispatchEvent( event ) );
		this.ref.addEventListener( 'sleepy', event => this.entity.dispatchEvent( event ) );
		this.ref.addEventListener( 'sleep', event => this.entity.dispatchEvent( event ) );

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onMaterialLoad( key, json ) {

		const material = new Material( json );
		this.ref.material = material;
		this.app.assets.add( key, material );

	}

	onEnable() {

		this.app.physics.addBody( this.ref );

	}

	onDisable() {

		this.app.physics.removeBody( this.ref );

	}

}

Rigidbody.config = {
	schema: {
		type: { type: 'select', default: 'dynamic', select: types },
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

		material: { type: 'asset' },
		collisionResponse: { default: true },
		collisionFilterGroup: { type: 'int', default: 1 },
		collisionFilterMask: { type: 'int', default: - 1 },
	}
};

ComponentManager.registerComponent( 'rigidbody', Rigidbody );
