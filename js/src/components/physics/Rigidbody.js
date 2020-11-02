import { OIMO } from "../../lib/oimoPhysics.js";
import { Physics } from "../../core/Physics.js";

class Rigidbody {
	init(data) {
		this._position = this.entity.position;
		this._rotation = this.entity.rotation;

		if ("_physicsRef" in this.entity) {
			this._ref = this.entity._physicsRef;
		} else {
			Rigidbody.config.position.copyFrom(this._position);
			Rigidbody.config.rotation.fromEulerXyz(this._rotation);

			this.entity._physicsRef = this._ref = new OIMO.RigidBody(
				Rigidbody.config
			);
		}

		if ("angularVelocity" in data)
			this.setAngularVelocity(data.angularVelocity);

		if ("linearVelocity" in data)
			this.setLinearVelocity(data.linearVelocity);

		if ("linearDamping" in data) this.linearDamping = data.linearDamping;

		this.isKinematic = "isKinematic" in data ? data.isKinematic : false;

		if ("useGravity" in data && !data.useGravity) {
			this.gravityScale = 0;
		}
	}

	onEnable() {
		if (this._ref.getNumShapes() > 0) {
			if (this._isKinematic) this._ref.setType(2);
			else this._ref.setType(0);
		} else {
			Physics._world.addRigidBody(this._ref);
		}
	}

	onDisable() {
		if (this._ref.getNumShapes() > 0) {
			this._ref.setType(1);
		} else {
			Physics._world.removeRigidBody(this._ref);
		}
	}

	// https://saharan.github.io/OimoPhysics/oimo/dynamics/rigidbody/RigidBody.html
	addAngularVelocity(v) {
		this._ref.addAngularVelocity(v);
	}
	addLinearVelocity(v) {
		this._ref.addAngularVelocity(v);
	}
	applyAngularImpulse(v) {
		this._ref.applyAngularImpulse(v);
	}
	applyForce(v, w) {
		this._ref.applyForce(v, w);
	}
	applyForceToCenter(v) {
		this._ref.applyForceToCenter(v);
	}
	applyImpulse(v, w) {
		this._ref.applyImpulse(v, w);
	}
	applyLinearImpulse(v) {
		this._ref.applyLinearImpulse(v);
	}
	applyTorque(v) {
		this._ref.applyTorque(v);
	}
	get angularDamping() {
		return this._ref.getAngularDamping();
	}
	getAngularVelocity() {
		const v = this._ref.getAngularVelocity();
		return new Vector3(v.x, v.y, v.z);
	}
	get gravityScale() {
		return this._ref.getGravityScale();
	}
	get linearDamping() {
		return this._ref.getLinearDamping();
	}
	getLinearVelocity() {
		const v = this._ref.getLinearVelocity();
		return new Vector3(v.x, v.y, v.z);
	}
	getLocalInertia() {
		const v = this._ref.getLocalInertia();
		return new Matrix3().set(
			v.e00,
			v.e01,
			v.e02,
			v.e10,
			v.e11,
			v.e12,
			v.e20,
			v.e21,
			v.e22
		);
	}
	get mass() {
		return this._ref.getMass();
	}
	get sleepTime() {
		return this._ref.getSleepTime();
	}
	get isKinematic() {
		return this.isKinematic;
	}
	set isKinematic(v) {
		this._isKinematic = v;
		if (v) this._ref.setType(2);
		else this._ref.setType(0);
	}
	isSleeping() {
		return this._ref.isSleeping();
	}
	rotate(v) {
		this._ref.rotateXyz(v);
	}
	set angularDamping(v) {
		this._ref.setAngularDamping(v);
	}
	setAngularVelocity(v) {
		this._ref.setAngularVelocity(v);
	}
	setAutoSleep(v) {
		this._ref.setAutoSleep(v);
	}
	set gravityScale(v) {
		this._ref.setGravityScale(v);
	}
	set linearDamping(v) {
		this._ref.setLinearDamping(v);
	}
	setLinearVelocity(v) {
		this._ref.setLinearVelocity(v);
	}
	set mass(v) {
		const w = this._ref.getMassData();
		w.mass = v;
		this._ref.setMassData(w);
	}
	sleep() {
		this._ref.sleep();
	}

	wakeUp() {
		this._ref.wakeUp();
	}
}

Rigidbody.config = new OIMO.RigidBodyConfig();

ENGINE.createComponent("Rigidbody", Rigidbody);
