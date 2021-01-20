import { ComponentManager } from '../../core/ComponentManager.js';
import { OIMO } from '../../lib/oimo.js';
import { Vector3 } from '../../lib/three.js';

import { AngularLimit } from '../../physics/AngularLimit.js';
import { LinearLimit } from '../../physics/LinearLimit.js';
import { SpringDamper } from '../../physics/SpringDamper.js';

const configs = {
	cylindrical: new OIMO.CylindricalJointConfig(),
	prismatic: new OIMO.PrismaticJointConfig(),
	ragdoll: new OIMO.RagdollJointConfig(),
	hinge: new OIMO.RevoluteJointConfig(),
	ball: new OIMO.SphericalJointConfig(),
	universal: new OIMO.UniversalJointConfig(),
};

const rigidbodyConfig = new OIMO.RigidBodyConfig();
rigidbodyConfig.type = 1;
const worldBody = new OIMO.RigidBody( rigidbodyConfig );

export class Joint {

	init( data ) {

		const type = this.type = data.type;

		configs[ type ].rigidBody1 = this.entity._physicsRef;

		this._bodyRef2 = data.linkedEntity !== null ? this.entity.scene.getEntityByProperty( 'uuid', data.linkedEntity )._physicsRef : worldBody;
		this._allowCollision = data.allowCollision;
		this._breakForce = data.breakForce;
		this._breakTorque = data.breakTorque;
		this._anchor = data.anchor;
		this._linkedAnchor = data.linkedAnchor;

		switch ( type ) {

			case 'ball':
				this.springDamper = data.springDamper;
				break;
			case 'cylindrical':
				this._axis = data.axis;
				this._linkedAxis = data.linkedAxis;
				this.linearLimit = data.linearLimit;
				this.linearSpringDamper = data.linearSpringDamper;
				this.angularLimit = data.angularLimit;
				this.angularSpringDamper = data.angularSpringDamper;
				break;
			case 'hinge':
				this._axis = data.axis;
				this._linkedAxis = data.linkedAxis;
				this.springDamper = data.springDamper;
				this.angularLimit = data.angularLimit;
				break;
			case 'prismatic':
				this._axis = data.axis;
				this._linkedAxis = data.linkedAxis;
				this.springDamper = data.springDamper;
				this.linearLimit = data.linearLimit;
				break;
			case 'ragdoll':
				this._twistAxis = data.twistAxis;
				this._linkedTwistAxis = data.linkedTwistAxis;
				this._swingAxis = data.swingAxis;
				this._maxSwing = data.maxSwing;
				this._linkedMaxSwing = data.linkedMaxSwing;
				this.twistSpringDamper = data.twistSpringDamper;
				this.swingSpringDamper = data.swingSpringDamper;
				this.twistLimit = data.twistLimit;
				break;
			case 'universal':
				this._axis = data.axis;
				this._linkedAxis = data.linkedAxis;
				this.springDamper = data.springDamper;
				this.linkedSpringDamper = data.linkedSpringDamper;
				this.angularLimit = data.angularLimit;
				this.linkedAngularLimit = data.linkedAngularLimit;
				break;
			default:
				throw new Error( 'Joint: invalid joint type ' + type );

		}

		this._setJoint();

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );
		this.entity.addEventListener( 'scenechange', this.onSceneChange );

	}

	onEnable() {

		this.scene._physicsWorld.addJoint( this._ref );

	}

	onDisable() {

		this.scene._physicsWorld.removeJoint( this._ref );

	}

	onSceneChange( event ) {

		// need to test
		if ( this._enabled ) {

			event.oldScene._physicsWorld.removeJoint( this._ref );
			event.newScene._physicsWorld.addJoint( this._ref );

		}

	}

	_setJoint() {

		let enable = false;
		const type = this.type;
		const config = configs[ type ];
		config.allowCollision = this._allowCollision;
		config.breakForce = this._breakForce;
		config.breakTorque = this._breakTorque;
		config.localAnchor1 = this._anchor;
		config.localAnchor2 = this._linkedAnchor;
		config.rigidBody2 = this._bodyRef2;
		if ( this._ref !== undefined && this._enabled ) {

			this.scene._physicsWorld.removeJoint( this._ref );
			enable = true;

		}

		switch ( type ) {

			case 'ball':
				config.springDamper = this.springDamper;
				this._ref = new OIMO.SphericalJoint( config );
				break;
			case 'cylindrical':
				config.localAxis1 = this._axis;
				config.localAxis2 = this._linkedAxis;

				config.translationalLimitMotor = this.linearLimit;
				config.translationalSpringDamper = this.linearSpringDamper;
				config.rotationalLimitMotor = this.angularLimit;
				config.rotationalSpringDamper = this.angularSpringDamper;
				this._ref = new OIMO.CylindricalJoint( config );
				break;
			case 'hinge':
				config.localAxis1 = this._axis;
				config.localAxis2 = this._linkedAxis;
				config.springDamper = this.springDamper;

				config.limitMotor = this.angularLimit;
				this._ref = new OIMO.RevoluteJoint( config );
				break;
			case 'prismatic':
				config.localAxis1 = this._axis;
				config.localAxis2 = this._linkedAxis;
				config.springDamper = this.springDamper;

				config.limitMotor = this.linearLimit;
				this._ref = new OIMO.PrismaticJoint( config );

				break;
			case 'ragdoll':
				config.localTwistAxis1 = this._twistAxis;
				config.localTwistAxis2 = this._linkedTwistAxis;
				config.localSwingAxis1 = this._swingAxis;
				config.maxSwingAngle1 = this._maxSwing;
				config.maxSwingAngle2 = this._linkedMaxSwing;
				config.twistSpringDamper = this.twistSpringDamper;
				config.swingSpringDamper = this.swingSpringDamper;
				config.twistLimitMotor = this.twistLimit;
				this._ref = new OIMO.RagdollJoint( config );
				break;
			case 'universal':
				config.localAxis1 = this._axis;
				config.localAxis2 = this._linkedAxis;

				config.springDamper1 = this.springDamper;
				config.springDamper2 = this.linkedSpringDamper;
				config.limitMotor1 = this.angularLimit;
				config.limitMotor2 = this.linkedAngularLimit;
				this._ref = new OIMO.UniversalJoint( config );

		}

		this._ref.component = this;
		if ( enable ) this.scene._physicsWorld.addJoint( this._ref );

	}

	// joint
	get allowCollision() {

		return this._allowCollision;

	}

	set allowCollision( allowCollision ) {

		this._allowCollision = allowCollision;
		this._ref.setAllowCollision( allowCollision );

	}

	// local anchor
	get anchor() {

		return this._anchor;

	}

	set anchor( anchor ) {

		this._anchor = anchor;
		this._setJoint();

	}

	get linkedAnchor() {

		return this._linkedAnchor;

	}

	set linkedAnchor( anchor ) {

		this._linkedAnchor = anchor;
		this._setJoint();

	}

	get appliedForce() {

		const vector = new Vector3();
		this._ref.getAppliedForceTo( vector );
		return vector;

	}

	get appliedTorque() {

		const vector = new Vector3();
		this._ref.getAppliedTorqueTo( vector );
		return vector;

	}

	get breakForce() {

		this._breakForce;

	}

	set breakForce( force ) {

		this._breakForce = force;
		this._ref.setBreakForce( force );

	}

	get breakTorque() {

		this._ref.getBreakTorque();

	}

	set breakTorque( torque ) {

		this._ref.setBreakTorque( torque );

	}

	get linkedEntity() {

		const body = this._bodyRef2;
		if ( body === worldBody ) return null;
		return body.entity;

	}

	set linkedEntity( entity ) {

		this._bodyRef2 = entity === null ? worldBody : entity._physicsRef;
		this._setJoint();

	}

	// prismatic joint

	// local axis
	get axis() {

		return this._axis;

	}

	set axis( axis ) {

		this._axis = axis;
		this._setJoint();

	}

	get linkedAxis() {

		return this._linkedAxis;

	}

	set linkedAxis( axis ) {

		this._linkedAxis = axis;
		this._setJoint();

	}

	// ragdoll joint

	get swingAxis() {

		return this._swingAxis;

	}

	set swingAxis( axis ) {

		this._swingAxis = axis;
		this._setJoint();

	}

	get twistAxis() {

		return this._twistAxis;

	}

	set twistAxis( axis ) {

		this._twistAxis = axis;
		this._setJoint();

	}

	get linkedTwistAxis() {

		return this._linkedTwistAxis;

	}

	set linkedTwistAxis( axis ) {

		this._linkedTwistAxis = axis;
		this._setJoint();

	}

	get maxSwing() {

		return this._maxSwing;

	}

	set maxSwing( angle ) {

		this._maxSwing = angle;
		this._setJoint();

	}

	get linkedMaxSwing() {

		return this._linkedMaxSwing;

	}

	set linkedMaxSwing( angle ) {

		this._linkedMaxSwing = angle;
		this._setJoint();

	}

	// revolute joint and universal
	get angle() {

		if ( this.type === 'universal' ) return this._ref.getAngle1();
		return this._ref.getAngle();

	}

	// SphericalJoint

	// UniversalJoint
	get linkedAngle() {

		return this._ref.getAngle2();

	}

}

ComponentManager.register( 'joint', Joint, {
	dependencies: [ 'rigidbody' ],
	schema: {
		type: { type: 'select', default: 'universal', select: [ 'ball', 'cylindrical', 'hinge', 'prismatic', 'ragdoll', 'universal' ] },
		linkedEntity: { type: 'entity' },
		allowCollision: { default: false },
		breakForce: { default: 0 },
		breakTorque: { default: 0 },
		anchor: { type: 'vector3' },
		linkedAnchor: { type: 'vector3' },
		springDamper: { default: SpringDamper, if: { type: [ 'ball', 'hinge', 'prismatic', 'universal' ] } },
		axis: { type: 'vector3', default: [ 1, 0, 0 ], if: { type: [ 'cylindrical', 'hinge', 'prismatic', 'universal' ] } },
		linkedAxis: { type: 'vector3', default: [ 1, 0, 0 ], if: { type: [ 'cylindrical', 'hinge', 'prismatic', 'universal' ] } },
		linearLimit: { default: LinearLimit, if: { type: [ 'cylindrical', 'prismatic' ] } },
		linearSpringDamper: { default: SpringDamper, if: { type: [ 'cylindrical' ] } },
		angularLimit: { default: AngularLimit, if: { type: [ 'cylindrical', 'hinge', 'universal' ] } },
		angularSpringDamper: { default: SpringDamper, if: { type: [ 'cylindrical' ] } },
		twistAxis: { type: 'vector3', default: [ 1, 0, 0 ], if: { type: [ 'ragdoll' ] } },
		linkedTwistAxis: { type: 'vector3', default: [ 1, 0, 0 ], if: { type: [ 'ragdoll' ] } },
		swingAxis: { type: 'vector3', default: [ 0, 1, 0 ], if: { type: [ 'ragdoll' ] } },
		maxSwing: { default: Math.PI, if: { type: [ 'ragdoll' ] } },
		linkedMaxSwing: { default: Math.PI, if: { type: [ 'ragdoll' ] } },
		twistSpringDamper: { default: SpringDamper, if: { type: [ 'ragdoll' ] } },
		swingSpringDamper: { default: SpringDamper, if: { type: [ 'ragdoll' ] } },
		twistLimit: { default: AngularLimit, if: { type: [ 'ragdoll' ] } },
		linkedSpringDamper: { default: SpringDamper, if: { type: [ 'universal' ] } },
		linkedAngularLimit: { default: AngularLimit, if: { type: [ 'universal' ] } },
	}
} );
