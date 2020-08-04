import * as THREE from "./three.module.js";
import OIMO from "./oimoPhysics.js";
import System from "./system.js";

class Rigidbody {
	constructor(id, data) {
		// data.hasOwnProperty("mass") ? data.mass : 1;
		// data.hasOwnProperty("useGravity")
		// 	? data.useGravity
		// 	: true;

		this._position = Component.components.Transform[id].position;
		this._rotation = Component.components.Transform[id].rotation;

		this._previousState = {
			position: new THREE.Vector3(),
			rotation: new THREE.Euler(),
		};

		if (Component.components.Collider.hasOwnProperty(id)) {
			this._ref = Component.components.Collider[id]._ref;
		} else {
			Rigidbody._config.angularDamping = data.hasOwnProperty(
				"angularDamping"
			)
				? data.angularDamping
				: 0.05;
			Rigidbody._config.angularVelocity = data.hasOwnProperty(
				"angularVelocity"
			)
				? (Rigidbody._config.angularVelocity.init(
						data.angularVelocity.x,
						data.angularVelocity.y,
						data.angularVelocity.z
				  ),
				  delete data.angularVelocity)
				: Rigidbody._config.angularVelocity.zero();
			Rigidbody._config.autoSleep = data.hasOwnProperty("autoSleep")
				? data.autoSleep
				: true;
			Rigidbody._config.linearDamping = data.hasOwnProperty(
				"linearDamping"
			)
				? data.linearDamping
				: 0;
			Rigidbody._config.linearVelocity = data.hasOwnProperty(
				"linearVelocity"
			)
				? (Rigidbody._config.linearVelocity.init(
						data.linearVelocity.x,
						data.linearVelocity.y,
						data.linearVelocity.z
				  ),
				  delete data.linearVelocity)
				: Rigidbody._config.linearVelocity.zero();
			Rigidbody._config.position = data.hasOwnProperty("position")
				? Rigidbody._config.position.init(
						data.position.x,
						data.position.y,
						data.position.z
				  )
				: Rigidbody._config.position.zero();
			Rigidbody._config.rotation = data.hasOwnProperty("rotation")
				? (Rigidbody._config.rotation.fromEulerXyz(
						new OIMO.Vec3(
							data.rotation.x,
							data.rotation.y,
							data.rotation.z
						)
				  ),
				  delete data.rotation)
				: Rigidbody._config.rotation.init(0, 0, 0, 0, 0, 0, 0, 0, 0);
			Rigidbody._config.type = data.hasOwnProperty("setKinematic")
				? data.setKinematic
					? 2
					: 0
				: 0;

			this._ref = new OIMO.RigidBody(Rigidbody._config);
		}
	}
	// https://saharan.github.io/OimoPhysics/oimo/dynamics/rigidbody/RigidBody.html
	addAngularVelocity(v) {
		this._ref.addAngularVelocity(new OIMO.Vec3(v.x, v.y, v.z));
	}
	addLinearVelocity(v) {
		this._ref.addAngularVelocity(new OIMO.Vec3(v.x, v.y, v.z));
	}
	applyAngularImpulse(v) {
		this._ref.applyAngularImpulse(new OIMO.Vec3(v.x, v.y, v.z));
	}
	applyForce(v, w) {
		this._ref.applyForce(
			new OIMO.Vec3(v.x, v.y, v.z),
			new OIMO.Vec3(w.x, w.y, w.z)
		);
	}
	applyForceToCenter(v) {
		this._ref.applyForceToCenter(new OIMO.Vec3(v.x, v.y, v.z));
	}
	applyImpulse(v, w) {
		this._ref.applyImpulse(
			new OIMO.Vec3(v.x, v.y, v.z),
			new OIMO.Vec3(w.x, w.y, w.z)
		);
	}
	applyLinearImpulse(v) {
		this._ref.applyLinearImpulse(new OIMO.Vec3(v.x, v.y, v.z));
	}
	applyTorque(v) {
		this._ref.applyTorque(new OIMO.Vec3(v.x, v.y, v.z));
	}
	getAngularDamping() {
		return this._ref.getAngularDamping();
	}
	getAngularVelocity() {
		const v = this._ref.getAngularVelocity();
		return new THREE.Vector3(v.x, v.y, v.z);
	}
	getAngularVelocityTo(v) {
		this._ref.getAngularVelocityTo(new OIMO.Vec3(v.x, v.y, v.z));
	}
	getContactLinkList() {
		return this._ref.getContactLinkList();
	}
	getGravityScale() {
		return this._ref.getGravityScale();
	}
	getJointLinkList() {
		return this._ref.getJointLinkList();
	}
	getLinearDamping() {
		return this._ref.getLinearDamping();
	}
	getLinearVelocity() {
		const v = this._ref.getLinearVelocity();
		return new THREE.Vector3(v.x, v.y, v.z);
	}
	getLinearVelocityTo(v) {
		this._ref.getLinearVelocityTo(new OIMO.Vec3(v.x, v.y, v.z));
	}
	getLocalInertia() {
		const v = this._ref.getLocalInertia();
		return new THREE.Matrix3().set(
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
	getLocalInertiaTo(v) {
		const w = v.elements;
		this._ref.getLocalInertiaTo(
			new OIMO.Mat3(w[0], w[3], w[6], w[1], w[4], w[7], w[2], w[5], w[8])
		);
	}
	getMass() {
		return this._ref.getMass();
	}
	getNumContactLinks() {
		return this._ref.getNumContactLinks();
	}
	getNumJointLinks() {
		return this._ref.getNumJointLinks();
	}
	getOrientation() {
		const v = this._ref.getOrientation();
		return new THREE.Quaternion(v.x, v.y, v.z, v.w);
	}
	getOrientationTo(v) {
		this._ref.getOrientationTo(new OIMO.Quat(v.x, v.y, v.z, v.w));
	}
	getPosition() {
		const v = this._ref.getPosition();
		return new THREE.Vector3(v.x, v.y, v.z);
	}
	getPositionTo(v) {
		this._ref.getPositionTo(new OIMO.Vec3(v.x, v.y, v.z));
	}
	getRotation(v) {
		const v = this._ref.getRotation();
		return new THREE.Mat3(
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
	getRotationFactor() {
		const v = this._ref.getRotationFactor();
		return new THREE.Vector3(v.x, v.y, v.z);
	}
	getRotationTo(v) {
		const w = v.elements;
		this._ref.getRotationTo(
			new OIMO.Mat3(w[0], w[3], w[6], w[1], w[4], w[7], w[2], w[5], w[8])
		);
	}
	getSleepTime() {
		return this._ref.getSleepTime();
	}
	isKinematic() {
		return this._ref.getType() == 2;
	}
	setKinematic(v) {
		this._ref.setType(v ? 2 : 0);
	}
	getWorldPoint(v) {
		const w = this._ref.getWorldPoint(new THREE.Vector3(v.x, v.y, v.z));
		return new THREE.Vector3(w.x, w.y, w.z);
	}
	getWorldPointTo(v, w) {
		this._ref.getWorldPointTo(
			new OIMO.Vec3(v.x, v.y, v.z),
			new OIMO.Vec3(w.x, w.y, w.z)
		);
	}
	getWorldVector(v) {
		const w = this._ref.getWorldVector(new THREE.Vector3(v.x, v.y, v.z));
		return new THREE.Vector3(w.x, w.y, w.z);
	}
	getWorldVectorTo(v, w) {
		this._ref.getWorldVectorTo(
			new OIMO.Vec3(v.x, v.y, v.z),
			new OIMO.Vec3(w.x, w.y, w.z)
		);
	}
	isSleeping() {
		return this._ref.isSleeping();
	}
	rotate(v) {
		const w = v.elements;
		this._ref.rotate(
			new OIMO.Mat3(w[0], w[3], w[6], w[1], w[4], w[7], w[2], w[5], w[8])
		);
	}
	rotateXyz(v) {
		this._ref.rotateXyz(new OIMO.Vec3(v.x, v.y, v.z));
	}
	setAngularDamping(v) {
		this._ref.setAngularDamping(v);
	}
	setAngularVelocity(v) {
		this._ref.setAngularVelocity(new OIMO.Vec3(v.x, v.y, v.z));
	}
	setAutoSleep(v) {
		this._ref.setAutoSleep(v);
	}
	setGravityScale(v) {
		this._ref.setGravityScale(v);
	}
	setLinearDamping(v) {
		this._ref.setLinearDamping(v);
	}
	setLinearVelocity(v) {
		this._ref.setLinearVelocity(new OIMO.Vec3(v.x, v.y, v.z));
	}
	setOrientation(v) {
		this._ref.setOrientation(new OIMO.Quat(v.x, v.y, v.z, v.w));
	}
	setPosition(v) {
		this._ref.setPosition(new OIMO.Vec3(v.x, v.y, v.z));
	}
	setRotation(v) {
		const w = v.elements;
		this._ref.setRotation(
			new OIMO.Mat3(w[0], w[3], w[6], w[1], w[4], w[7], w[2], w[5], w[8])
		);
	}
	setRotationFactor(v) {
		this._ref.setRotationFactor(new OIMO.Vec3(v.x, v.y, v.z));
	}
	setRotationXyz(v) {
		this._ref.setRotationXyz(new OIMO.Vec3(v.x, v.y, v.z));
	}
	sleep() {
		this._ref.sleep();
	}
	translate(v) {
		this._ref.translate(new OIMO.Vec3(v.x, v.y, v.z));
	}
	wakeUp() {
		this._ref.wakeUp();
	}
}

const Component = {
	Animation: function (id, data) {
		return data;
	},
	Behavior: function (id, data) {
		return data;
	},
	Collider: class {
		constructor(id, data) {}
	},
	BoxCollider: class {
		constructor(id, data) {}
	},
	CapsuleCollider: class {
		constructor(id, data) {}
	},
	ConeCollider: class {
		constructor(id, data) {}
	},
	CylinderCollider: class {
		constructor(id, data) {}
	},
	MeshCollider: class {
		constructor(id, data) {}
	},
	SphereCollider: class {
		constructor(id, data) {}
	},
	Interactable: function (id, data) {},
	Object3D: function (id, data = new THREE.Object3D()) {
		System.render.scene.add(data);
		return data;
	},
	Rigidbody: Rigidbody,
	Transform: function (id, data) {
		data.position = data.hasOwnProperty("position")
			? data.position
			: new THREE.Vector3();
		data.rotation = data.hasOwnProperty("rotation")
			? data.rotation
			: new THREE.Euler();
		data.scale = data.hasOwnProperty("scale")
			? data.scale
			: new THREE.Vector3(1, 1, 1);

		return data;
	},
};

Object.defineProperty(Component, "components", {
	enumerable: false,
	value: {},
});
for (const type in Component) Component.components[type] = {};

Component.Rigidbody._config = new OIMO.RigidBodyConfig();
Component.Collider._config = new OIMO.ShapeConfig();

export default Component;
