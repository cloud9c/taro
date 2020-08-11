import { OIMO } from "../lib/oimoPhysics.js";
import { System } from "../System.js";
import { Euler } from "../math/Euler.js";
import { Vector3 } from "../math/Vector3.js";

class Rigidbody {
	init(data) {
		this._position = this.entity.Transform._position;
		this._rotation = this.entity.Transform._rotation;

		this._previousState = {
			position: new Vector3(),
			rotation: new Euler(),
		};

		this.interpolate = data.hasOwnProperty("interpolate")
			? data.interpolate
			: false;

		if (this.entity.hasOwnProperty("Collider")) {
			this._ref = this.entity.Collider._ref;
		} else {
			Rigidbody._config.angularDamping = data.hasOwnProperty(
				"angularDamping"
			)
				? data.angularDamping
				: 0.05;
			Rigidbody._config.angularVelocity = data.hasOwnProperty(
				"angularVelocity"
			)
				? Rigidbody._config.angularVelocity.copyFrom(
						data.angularVelocity
				  )
				: Rigidbody._config.angularVelocity.zero();
			Rigidbody._config.linearDamping = data.hasOwnProperty(
				"linearDamping"
			)
				? data.linearDamping
				: 0;
			Rigidbody._config.linearVelocity = data.hasOwnProperty(
				"linearVelocity"
			)
				? Rigidbody._config.linearVelocity.copyFrom(data.linearVelocity)
				: Rigidbody._config.linearVelocity.zero();
			Rigidbody._config.position = Rigidbody._config.position.copyFrom(
				this._position
			);
			Rigidbody._config.rotation = Rigidbody._config.rotation.fromEulerXyz(
				this._rotation
			);

			this._ref = new OIMO.RigidBody(Rigidbody._config);
			this.mass = data.hasOwnProperty("mass")
				? data.mass > 0.0000001
					? data.mass
					: 0.0000001
				: 1;
		}
		this.type = data.hasOwnProperty("type") ? data.type : "dynamic";
		if (data.hasOwnProperty("useGravity") && !data.useGravity) {
			this.setGravityScale(0);
		}
		System.world.addRigidBody(this._ref);
	}

	_update() {
		if (this.interpolate) {
			this._previousState.position.copy(this._position);
			this._previousState.rotation.copy(this._rotation);
		}
		this._position.copy(this._ref.getPosition());
		this._rotation.setFromVector3(this._ref.getRotation().toEulerXyz());
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
	isKinematic() {
		return this._ref.getType() == 2;
	}
	get type() {
		return this._ref.getType() == 2 ? "kinematic" : "dynamic";
	}
	set type(v) {
		this._ref.setType(v == "kinematic" ? 2 : 0);
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

Rigidbody._config = new OIMO.RigidBodyConfig();

export { Rigidbody };
