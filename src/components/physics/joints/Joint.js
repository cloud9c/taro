import { OIMO } from "../../../lib/oimo.js";
import { Vector3 } from "../../../lib/three.js";

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

		const type = data.type;

		configs[ type ].rigidBody1 = this.entity._physicsRef;

		this._bodyRef2 = data.linkedEntity !== undefined && data.linkedEntity !== null ? data.linkedEntity._physicsRef : worldBody;
		this._allowCollision = data.allowCollision === true;
		this._breakForce = data.breakForce !== undefined && data.breakForce !== 0 ? data.breakForce : 0;
		this._breakTorque = data.breakTorque !== undefined && data.breakTorque !== 0 ? data.breakTorque : 0;
		this._anchor = data.anchor !== undefined ? data.anchor : new Vector3();
		this._linkedAnchor = data.linkedAnchor !== undefined ? data.linkedAnchor : new Vector3();

		this._addDerivedProperties( data );
		this._setJoint();

		this.addEventListener( "enable", this.onEnable );
		this.addEventListener( "disable", this.onDisable );
		this.entity.addEventListener( "scenechange", this.onSceneChange );

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

		this._setDerivedJoint( config );

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

		if ( this.type === "universal" ) return this._ref.getAngle1();
		return this._ref.getAngle();

	}

	// SphericalJoint

	// UniversalJoint
	get linkedAngle() {

		return this._ref.getAngle2();

	}

	toJSON() {

		return {
			linkedEntity: this._bodyRef2.UUID,
			breakForce: this._breakForce,
			breakTorque: this._breakTorque,
			anchor: this._anchor.toArray(),
			linkedAnchor: this._linkedAnchor.toArray(),
		};

	}

	fromJSON( object ) {

		object.linkedEntity = this.scene.findById( object.linkedEntity );
		object.anchor = new Vector3().fromArray( object.anchor );
		object.linkedAnchor = new Vector3().fromArray( object.linkedAnchor );

		return object;

	}

}
