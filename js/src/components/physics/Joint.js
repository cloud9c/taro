import { OIMO } from "../../lib/oimoPhysics.js";
import { Physics } from "../../core/Physics.js";
import { AngularLimit } from "../../physics/AngularLimit.js";
import { LinearLimit } from "../../physics/LinearLimit.js";
import { SpringDamper } from "../../physics/SpringDamper.js";
import { Vector3 } from "../../engine.js";

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
const worldBody = new OIMO.RigidBody(rigidbodyConfig);

export class Joint {
	start(data) {
		const type = this.type;

		configs[type].rigidBody1 = this.entity._physicsRef;
		this._bodyRef2 =
			"linkedEntity" in data && data.linkedEntity !== null
				? data.linkedEntity._physicsRef
				: worldBody;
		this._allowCollision = data.allowCollision === true;
		this._breakForce =
			"breakForce" in data && data.breakForce !== 0 ? data.breakForce : 0;
		this._breakTorque =
			"breakTorque" in data && data.breakTorque !== 0
				? data.breakTorque
				: 0;
		this._anchor = "anchor" in data ? data.anchor : new Vector3();
		this._linkedAnchor =
			"linkedAnchor" in data ? data.linkedAnchor : new Vector3();

		switch (type) {
			case "universal":
			case "cylindrical":
			case "prismatic":
			case "hinge":
				this._axis = "axis" in data ? data.axis : new Vector3(1, 0, 0);
				this._linkedAxis =
					"axis" in data ? data.linkedAxis : new Vector3(1, 0, 0);
		}
		switch (type) {
			case "universal":
			case "prismatic":
			case "hinge":
			case "ball":
				Object.defineProperty(this, "springDamper", {
					value:
						"springDamper" in data
							? data.springDamper
							: new SpringDamper(),
				});
		}
		switch (type) {
			case "universal":
				Object.defineProperties(this, {
					linkedSpringDamper: {
						value:
							"linkedSpringDamper" in data
								? data.linkedSpringDamper
								: new SpringDamper(),
					},
					angularLimit: {
						value:
							"angularLimit" in data
								? data.angularLimit
								: new AngularLimit(),
					},
					linkedAngularLimit: {
						value:
							"linkedAngularLimit" in data
								? data.linkedAngularLimit
								: new AngularLimit(),
					},
				});
				break;
			case "cylindrical":
				Object.defineProperties(this, {
					linearLimit: {
						value:
							"linearLimit" in data
								? data.linearLimit
								: new LinearLimit(),
					},
					linearSpringDamper: {
						value:
							"linearSpringDamper" in data
								? data.linearSpringDamper
								: new SpringDamper(),
					},
					angularLimit: {
						value:
							"angularLimit" in data
								? data.angularLimit
								: new AngularLimit(),
					},
					angularSpringDamper: {
						value:
							"angularSpringDamper" in data
								? data.angularSpringDamper
								: new SpringDamper(),
					},
				});
				break;
			case "prismatic":
				Object.defineProperty(this, "linearLimit", {
					value:
						"linearLimit" in data
							? data.linearLimit
							: new LinearLimit(),
				});
				break;
			case "ragdoll":
				this._twistAxis =
					"twistAxis" in data ? data.twistAxis : new Vector3(1, 0, 0);
				this._linkedTwistAxis =
					"linkedTwistAxis" in data
						? data.linkedTwistAxis
						: new Vector3(1, 0, 0);
				this._swingAxis =
					"swingAxis" in data ? data.swingAxis : new Vector3(0, 1, 0);
				this._maxSwing = "maxSwing" in data ? data.maxSwing : Math.PI;
				this._linkedMaxSwing =
					"linkedMaxSwing" in data ? data.linkedMaxSwing : Math.PI;
				Object.defineProperties(this, {
					twistSpringDamper: {
						value:
							"twistSpringDamper" in data
								? data.twistSpringDamper
								: new SpringDamper(),
					},
					swingSpringDamper: {
						value:
							"swingSpringDamper" in data
								? data.swingSpringDamper
								: new SpringDamper(),
					},
					twistLimit: {
						value:
							"twistLimit" in data
								? data.twistLimit
								: new AngularLimit(),
					},
				});
				break;
			case "hinge":
				Object.defineProperty(this, "angularLimit", {
					value:
						"angularLimit" in data
							? data.angularLimit
							: new AngularLimit(),
				});
				break;
		}

		this._setJoint();

		this.addEventListener("enable", this.onEnable);
		this.addEventListener("disable", this.onDisable);
		this.entity.addEventListener("scenechange", this.onSceneChange);
	}

	onEnable() {
		this.entity.scene._physicsWorld.addJoint(this._ref);
	}

	onDisable() {
		this.entity.scene._physicsWorld.removeJoint(this._ref);
	}

	onSceneChange(event) {
		// need to test
		if (this._enabled) {
			event.oldScene._physicsWorld.removeJoint(this._ref);
			event.newScene._physicsWorld.addJoint(this._ref);
		}
	}

	_setJoint() {
		let enable = false;
		const type = this.type;
		const config = configs[type];
		config.allowCollision = this._allowCollision;
		config.breakForce = this._breakForce;
		config.breakTorque = this._breakTorque;
		config.localAnchor1 = this._anchor;
		config.localAnchor2 = this._linkedAnchor;
		config.rigidBody2 = this._bodyRef2;
		if (this._ref !== undefined && this._enabled) {
			this.entity.scene._physicsWorld.removeJoint(this._ref);
			enable = true;
		}
		switch (type) {
			case "universal":
			case "cylindrical":
			case "prismatic":
			case "hinge":
				config.localAxis1 = this._axis;
				config.localAxis2 = this._linkedAxis;
				break;
		}
		switch (type) {
			case "prismatic":
			case "hinge":
			case "ball":
				config.springDamper = this.springDamper;
		}
		switch (type) {
			case "universal":
				config.springDamper1 = this.springDamper;
				config.springDamper2 = this.linkedSpringDamper;
				config.limitMotor1 = this.angularLimit;
				config.limitMotor2 = this.linkedAngularLimit;
				this._ref = new OIMO.UniversalJoint(config);
				break;
			case "cylindrical":
				config.translationalLimitMotor = this.linearLimit;
				config.translationalSpringDamper = this.linearSpringDamper;
				config.rotationalLimitMotor = this.angularLimit;
				config.rotationalSpringDamper = this.angularSpringDamper;
				this._ref = new OIMO.CylindricalJoint(config);
				break;
			case "prismatic":
				config.limitMotor = this.linearLimit;
				this._ref = new OIMO.PrismaticJoint(config);
				break;
			case "ragdoll":
				config.localTwistAxis1 = this._twistAxis;
				config.localTwistAxis2 = this._linkedTwistAxis;
				config.localSwingAxis1 = this._swingAxis;
				config.maxSwingAngle1 = this._maxSwing;
				config.maxSwingAngle2 = this._linkedMaxSwing;
				config.twistSpringDamper = this.twistSpringDamper;
				config.swingSpringDamper = this.swingSpringDamper;
				config.twistLimitMotor = this.twistLimit;
				this._ref = new OIMO.RagdollJoint(config);
				break;
			case "hinge":
				config.limitMotor = this.angularLimit;
				this._ref = new OIMO.RevoluteJoint(config);
				break;
			case "ball":
				this._ref = new OIMO.SphericalJoint(config);
				break;
		}
		this._ref.component = this;
		if (enable) this.entity.scene._physicsWorld.addJoint(this._ref);
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
		this._setJoint();
	}

	get linkedAnchor() {
		return this._linkedAnchor;
	}

	set linkedAnchor(anchor) {
		this._linkedAnchor = anchor;
		this._setJoint();
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

	get linkedEntity() {
		const body = this._bodyRef2;
		if (body === worldBody) return null;
		return body.entity;
	}

	set linkedEntity(entity) {
		this._bodyRef2 = entity === null ? worldBody : entity._physicsRef;
		this._setJoint();
	}

	// prismatic joint

	// local axis
	get axis() {
		return this._axis;
	}

	set axis(axis) {
		this._axis = axis;
		this._setJoint();
	}

	get linkedAxis() {
		return this._linkedAxis;
	}

	set linkedAxis(axis) {
		this._linkedAxis = axis;
		this._setJoint();
	}

	// ragdoll joint

	get swingAxis() {
		return this._swingAxis;
	}

	set swingAxis(axis) {
		this._swingAxis = axis;
		this._setJoint();
	}

	get twistAxis() {
		return this._twistAxis;
	}

	set twistAxis(axis) {
		this._twistAxis = axis;
		this._setJoint();
	}

	get linkedTwistAxis() {
		return this._linkedTwistAxis;
	}

	set linkedTwistAxis(axis) {
		this._linkedTwistAxis = axis;
		this._setJoint();
	}

	get maxSwing() {
		return this._maxSwing;
	}

	set maxSwing(angle) {
		this._maxSwing = angle;
		this._setJoint();
	}

	get linkedMaxSwing() {
		return this._linkedMaxSwing;
	}

	set linkedMaxSwing(angle) {
		this._linkedMaxSwing = angle;
		this._setJoint();
	}

	// revolute joint and universal
	get angle() {
		if (this.type === "universal") return this._ref.getAngle1();
		return this._ref.getAngle();
	}

	// SphericalJoint

	// UniversalJoint
	get linkedAngle() {
		return this._ref.getAngle2();
	}

	// cylindrical
}
