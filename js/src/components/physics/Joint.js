import { OIMO } from "../../physics/oimoPhysics.js";
import { Physics } from "../../core/Physics.js";

const cylindricalConfig = new OIMO.CylindricalJointConfig();
const prismaticConfig = new OIMO.PrismaticJointConfig();
const ragdollConfig = new OIMO.RagdollJointConfig();
const revoluteConfig = new OIMO.RevoluteJointConfig();
const sphericalConfig = new OIMO.SphericalJointConfig();
const universalConfig = new OIMO.UniversalJointConfig();

const config = new OIMO.RigidBodyConfig();
config.type = 1;
const worldBody = new OIMO.RigidBody(config);

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

		this.setJoint(data);

		if (data.allowCollision === true) {
			this._ref.setAllowCollision(true);
		}

		if ("breakForce" in data && data.breakForce !== 0)
			this._ref.setBreakForce(data.breakForce);

		if ("breakTorque" in data && data.breakTorque !== 0)
			this._ref.setBreakTorque(data.breakTorque);

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

	setJoint(data) {
		switch (this.type) {
			case "universal":
				universalConfig;
				this._ref = new OIMO.UniversalJoint(universalConfig);
				break;
			case "cylindrical":
				this._ref = new OIMO.CylindricalJoint(cylindricalConfig);
				break;
			case "prismatic":
				this._ref = new OIMO.PrismaticJoint(prismaticConfig);
				break;
			case "ragdoll":
				this._ref = new OIMO.RagdollJoint(ragdollConfig);
				break;
			case "revolute":
				this._ref = new OIMO.RevoluteJoint(revoluteConfig);
				break;
			case "spherical":
				this._ref = new OIMO.SphericalJoint(sphericalConfig);
				break;
			default:
				throw new Error("Joint: invalid type" + this.type);
		}
		this.scene._physicsWorld.addJoint(this._ref);
	}

	// joint
	get allowCollision() {
		return this._ref.getAllowCollision();
	}

	set allowCollision(allowCollision) {
		return this._ref.setAllowCollision(allowCollision);
	}

	// local anchor
	get anchor() {
		const vector = new Vector3();
		this._ref.getLocalAnchor1To(vector);
		return vector;
	}

	set anchor(anchor) {
		// TODO
	}

	get connectedAnchor() {
		const vector = new Vector3();
		this._ref.getLocalAnchor2To(vector);
		return vector;
	}

	set connectedAnchor(anchor) {
		// TODO
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
		this._ref.getBreakForce();
	}

	set breakForce(force) {
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
		// TODO
	}

	// prismatic joint

	// local axis
	get axis() {
		const vector = new Vector3();
		this._ref.getAxis1To(vector);
		return vector;
	}

	set axis(axis) {
		// TODO
	}

	get connectedAxis() {
		const vector = new Vector3();
		this._ref.getAxis2To(vector);
		return vector;
	}

	set connectedAxis(axis) {
		// TODO
	}

	// prismatic and revolute and universal
	get limitMotor() {
		return this._ref.getLimitMotor();
	}

	// spring damper (and getSpringDamper1 in UniversalJoint)
	get springDamper() {
		return this._ref.getSpringDamper();
	}

	// ragdoll joint

	get swingAngle() {
		return this._ref.getSwingAngle();
	}

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
