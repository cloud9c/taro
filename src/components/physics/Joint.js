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

	start( data ) {

		const type = this.type = data.type !== undefined ? data.type : 'universal';

		configs[ type ].rigidBody1 = this.entity._physicsRef;

		this._bodyRef2 = data.linkedEntity !== undefined && data.linkedEntity !== null ? data.linkedEntity._physicsRef : worldBody;
		this._allowCollision = data.allowCollision === true;
		this._breakForce = data.breakForce !== undefined && data.breakForce !== 0 ? data.breakForce : 0;
		this._breakTorque = data.breakTorque !== undefined && data.breakTorque !== 0 ? data.breakTorque : 0;
		this._anchor = data.anchor !== undefined ? data.anchor : new Vector3();
		this._linkedAnchor = data.linkedAnchor !== undefined ? data.linkedAnchor : new Vector3();

		switch ( type ) {

			case 'ball':
				this.springDamper = data.springDamper !== undefined
					? data.springDamper
					: new SpringDamper();
				break;
			case 'cylindrical':
				this._axis = data.axis !== undefined ? data.axis : new Vector3( 1, 0, 0 );
				this._linkedAxis =
							data.linkedAxis !== undefined ? data.linkedAxis : new Vector3( 1, 0, 0 );

				this.linearLimit = data.linearLimit !== undefined
					? data.linearLimit
					: new LinearLimit();
				this.linearSpringDamper = data.linearSpringDamper !== undefined
					? data.linearSpringDamper
					: new SpringDamper();
				this.angularLimit = data.angularLimit !== undefined
					? data.angularLimit
					: new AngularLimit();
				this.angularSpringDamper = data.angularSpringDamper !== undefined
					? data.angularSpringDamper
					: new SpringDamper();
				break;
			case 'hinge':
				this._axis = data.axis !== undefined ? data.axis : new Vector3( 1, 0, 0 );
				this._linkedAxis = data.linkedAxis !== undefined ? data.linkedAxis : new Vector3( 1, 0, 0 );

				this.springDamper = data.springDamper !== undefined
					? data.springDamper
					: new SpringDamper();
				this.angularLimit = data.angularLimit !== undefined
					? data.angularLimit
					: new AngularLimit();
				break;
			case 'prismatic':
				this._axis = data.axis !== undefined ? data.axis : new Vector3( 1, 0, 0 );
				this._linkedAxis =
							data.linkedAxis !== undefined ? data.linkedAxis : new Vector3( 1, 0, 0 );

				this.springDamper = data.springDamper !== undefined
					? data.springDamper
					: new SpringDamper();
				this.linearLimit = data.linearLimit !== undefined
					? data.linearLimit
					: new LinearLimit();
				break;
			case 'ragdoll':
				this._twistAxis = data.twistAxis !== undefined ? data.twistAxis : new Vector3( 1, 0, 0 );
				this._linkedTwistAxis = data.linkedTwistAxis !== undefined ? data.linkedTwistAxis : new Vector3( 1, 0, 0 );
				this._swingAxis = data.swingAxis !== undefined ? data.swingAxis : new Vector3( 0, 1, 0 );
				this._maxSwing = data.maxSwing !== undefined ? data.maxSwing : Math.PI;
				this._linkedMaxSwing = data.linkedMaxSwing !== undefined ? data.linkedMaxSwing : Math.PI;
				this.twistSpringDamper = data.twistSpringDamper !== undefined ? data.twistSpringDamper : new SpringDamper();
				this.swingSpringDamper = data.swingSpringDamper !== undefined ? data.swingSpringDamper : new SpringDamper();
				this.twistLimit = data.twistLimit !== undefined ? data.twistLimit : new AngularLimit();
				break;
			case 'universal':
				this._axis = data.axis !== undefined ? data.axis : new Vector3( 1, 0, 0 );
				this._linkedAxis =
							data.linkedAxis !== undefined ? data.linkedAxis : new Vector3( 1, 0, 0 );

				this.springDamper = data.springDamper !== undefined
					? data.springDamper
					: new SpringDamper();
				this.linkedSpringDamper = data.linkedSpringDamper !== undefined
					? data.linkedSpringDamper
					: new SpringDamper();
				this.angularLimit = data.angularLimit !== undefined
					? data.angularLimit
					: new AngularLimit();
				this.linkedAngularLimit = data.linkedAngularLimit !== undefined
					? data.linkedAngularLimit
					: new AngularLimit();
				break;
			default:
				throw new Error( 'Joint: invalid joint type ' + type );

		}

		this._addDerivedProperties( data );
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
