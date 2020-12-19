import { OIMO } from "../../physics/oimoPhysics.js";
import { Physics } from "../../core/Physics.js";

const configs = {
	cylindrical: new OIMO.CylindricalJointConfig(),
	prismatic: new OIMO.PrismaticJointConfig(),
	ragdoll: new OIMO.RagdollJointConfig(),
	revolute: new OIMO.RevoluteJointConfig(),
	spherical: new OIMO.SphericalJointConfig(),
	universal: new OIMO.UniversalJointConfig(),
};

const rigidbodyConfig = new OIMO.RigidBodyConfig();
rigidbodyConfig.type = 1;
const worldBody = new OIMO.RigidBody(rigidbodyConfig);

export class Joint {
	start(data) {
		this.type = "type" in data ? data.type : "universal";
		this._bodyRef = this.entity.getComponent("RigidBody");
		if ("connectedBody" in data) {
			if (data.connectedBody.component.componentType === "RigidBody")
				this._bodyRef2 = data.connectedBody._ref;
			else
				throw new Error(
					"Joint: connectedBody must be a Rigidbody component"
				);
		} else {
			this._bodyRef2 = worldBody;
		}

		this._allowCollision = data.allowCollision === true;

		this._breakForce =
			"breakForce" in data && data.breakForce !== 0 ? data.breakForce : 0;

		this._breakTorque =
			"breakTorque" in data && data.breakTorque !== 0
				? data.breakTorque
				: 0;

		this._anchor = "anchor" in data ? data.anchor : new Vector3();
		this._connectedAnchor =
			"connectedAnchor" in data ? data.connectedAnchor : new Vector3();

		this.setJoint(data);

		this.addEventListener("enable", this.onEnable);
		this.addEventListener("disable", this.onDisable);
		this.entity.addEventListener("scenechange", this.onSceneChange);
	}

	onEnable() {}

	onDisable() {}

	onSceneChange(event) {
		// need to test
		/*		if (this.entity.enabled) {
			event.oldScene._physicsWorld.removeRigidBody(this._ref);
			event.newScene._physicsWorld.addRigidBody(this._ref);
		}*/
	}

	setJoint() {
		const config = configs[this.type];
		config.allowCollision = this._allowCollision;
		config.breakForce = this._breakForce;
		config.breakTorque = this._breakTorque;
		config.localAnchor1 = this._anchor;
		config.localAnchor2 = this._connectedAnchor;
		config.rigidBody1 = this._bodyRef;
		config.rigidBody2 = this._bodyRef2;
		switch (this.type) {
			case "universal":
				universalConfig;
				this._ref = new OIMO.UniversalJoint(config);
				break;
			case "cylindrical":
				this._ref = new OIMO.CylindricalJoint(config);
				break;
			case "prismatic":
				this._ref = new OIMO.PrismaticJoint(config);
				break;
			case "ragdoll":
				this._ref = new OIMO.RagdollJoint(config);
				break;
			case "revolute":
				this._ref = new OIMO.RevoluteJoint(config);
				break;
			case "spherical":
				this._ref = new OIMO.SphericalJoint(config);
				break;
			default:
				throw new Error("Joint: invalid type" + this.type);
		}
		this.scene._physicsWorld.addJoint(this._ref);
	}

	// joint
	get allowCollision() {
		return this._allowCollision;
	}

	set allowCollision(allowCollision) {
		this._allowCollision = allowCollision;
		this._ref.setAllowCollision(allowCollision);
	}

	// local anchor
	get anchor() {
		return this._anchor;
	}

	set anchor(anchor) {
		this._anchor = anchor;
		this.setJoint();
	}

	get connectedAnchor() {
		return this._connectedAnchor;
	}

	set connectedAnchor(anchor) {
		this._connectedAnchor = anchor;
		this.setJoint();
	}

	get appliedForce() {
		const vector = new Vector3();
		this._ref.getAppliedForceTo(vector);
		return vector;
	}

	get appliedTorque() {
		const vector = new Vector3();
		this._ref.getAppliedTorqueTo(vector);
		return vector;
	}

	get breakForce() {
		this._breakForce;
	}

	set breakForce(force) {
		this._breakForce = force;
		this._ref.setBreakForce(force);
	}

	get breakTorque() {
		this._ref.getBreakTorque();
	}

	set breakTorque(torque) {
		this._ref.setBreakTorque(torque);
	}

	get connectedBody() {
		const body = this._bodyRef2;
		if (body === worldBody) return null;
		return body.component;
	}

	set connectedBody(body) {
		this._bodyRef2 = body === null ? worldBody : body;
		this.setJoint();
	}

	// prismatic joint

	// local axis
	get axis() {
		return this._axis;
	}

	set axis(axis) {
		this._axis = axis;
		this.setJoint();
	}

	get connectedAxis() {
		return this._connectedAxis;
	}

	set connectedAxis(axis) {
		this._connectedAxis = axis;
		this.setJoint();
	}

	// prismatic and revolute and universal
	get limitMotor() {
		return this._limitMotor;
	}

	// spring damper (and getSpringDamper1 in UniversalJoint)
	get springDamper() {
		return this._springDamper;
	}

	// ragdoll joint

	get swingAngle() {
		return this._swingAngle;
	}

	set maxSwingAngle(angle) {}

	set connectedMaxSwingAngle(angle) {}

	get swingAxis() {
		const vector = new Vector3();
		this._ref.getSwingAxisTo(vector);
		return vector;
	}

	get swingSpringDamper() {
		return this._ref.getSwingSpringDamper();
	}

	get twistAngle() {
		return this._ref.getTwistAngle();
	}

	get twistLimitMotor() {
		return this._ref.getTwistLimitMotor();
	}

	get twistSpringDamper() {
		return this._ref.getTwistSpringDamper();
	}

	// revolute joint and universal
	get angle() {
		if (this.type === "universal") return this._ref.getAngle1();
		return this._ref.getAngle();
	}

	// SphericalJoint

	// UniversalJoint
	get connectedAngle() {
		return this._ref.getAngle2();
	}

	get connectedLimitMotor() {
		return this._ref.getLimitMotor2();
	}

	get connectedSpringDamper() {
		return this._ref.getSpringDamper2();
	}

	// cylindrical

	get rotationalLimitMotor() {
		return this._ref.getRotationalLimitMotor();
	}

	get rotationalSpringDamper() {
		return this._ref.getRotationalSpringDamper();
	}

	get translationalLimitMotor() {
		return this._ref.getTranslationalLimitMotor();
	}

	get translationalSpringDamper() {
		return this._ref.getTranslationalSpringDamper();
	}
}
