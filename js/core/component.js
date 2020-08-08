import { Object3D } from "./three.module.js";
import OIMO from "./oimoPhysics.js";
import System from "./system.js";
import { Vector4, Vector3, Euler, Matrix3, Shape } from "./engine.js";
import { PerspectiveCamera, OrthographicCamera } from "./three.module.js";

class Rigidbody {
	constructor(id, data) {
		this._position = Component.components.transform[id]._position;
		this._rotation = Component.components.transform[id]._rotation;

		this._previousState = {
			position: new Vector3(),
			rotation: new Euler(),
		};

		this.interpolate = data.hasOwnProperty("interpolate")
			? data.interpolate
			: false;

		if (Component.components.collider.hasOwnProperty(id)) {
			this._ref = Component.components.collider[id]._ref;
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
		this._ref.setPosition(this._position);
		this._ref.setRotation(this._rotation);
		System.physics.world.addRigidBody(this._ref);
	}

	_interpolate() {
		this._previousState.position.copy(this._position);
		this._previousState.rotation.copy(this._rotation);
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

class Collider {
	constructor(id, data) {
		this.shapes = [];

		if (Component.components.rigidbody.hasOwnProperty(id)) {
			this._ref = Component.components.rigidbody[id]._ref;
		} else {
			Collider._config.position = Collider._config.position.copyFrom(
				Component.components.transform[id]._position
			);
			Collider._config.rotation = Collider._config.rotation.fromEulerXyz(
				Component.components.transform[id]._rotation
			);
			this._ref = new OIMO.RigidBody(Collider._config);
			System.physics.world.addRigidBody(this._ref);
		}
		this.add(data);
	}

	recomputeShapes() {
		for (let i = 0, len = this.shapes.length; i < len; i++) {
			this.shapes[i].recompute();
		}
	}

	add(shape) {
		this.shapes.push(shape);
		this._ref.addShape(shape._ref);
		shape.collider = this;
		return shape;
	}

	remove(shape) {
		const index = this.shapes.indexOf(shape);
		if (index !== -1) {
			this.shapes.splice(index, 1);
			this._ref.removeShape(shape._ref);
			shape.collider = null;
		} else {
			throw "Shape doesn't exist in this collider";
		}
	}
}

Collider._config = new OIMO.RigidBodyConfig();
Collider._config.type = 1;

class Transform {
	constructor(id, data) {
		this._id = id;
		this._position = data.hasOwnProperty("position")
			? data.position
			: new Vector3();
		this._rotation = data.hasOwnProperty("rotation")
			? data.rotation
			: new Euler();
		this._scale = data.hasOwnProperty("scale")
			? data.scale
			: new Vector3(1, 1, 1);
	}
	getPosition() {
		return this._position.clone();
	}
	setPosition(v) {
		this._position.copy(v);
		if (Component.components.rigidbody.hasOwnProperty(this._id))
			Component.components.rigidbody[this._id]._ref.setPosition(v);
	}
	getRotation() {
		return this._rotation.clone();
	}
	setRotation(v) {
		this._rotation.copy(v);
		if (Component.components.rigidbody.hasOwnProperty(this._id))
			Component.components.rigidbody[this._id]._ref.setRotationXyz(v);
	}
	getScale() {
		return this._scale.clone();
	}
	setScale(v) {
		this._scale.copy(v);
		if (Component.components.object3D.hasOwnProperty(this._id))
			Component.components.object3D[this._id].scale.copy(v);
		if (Component.components.collider.hasOwnProperty(this._id)) {
			Component.components.collider[id].recomputeShapes();
		}
	}
}

class Camera {
	constructor(id, data) {
		this._position = Component.components.transform[id]._position;
		this._rotation = Component.components.transform[id]._rotation;

		this.type = data.hasOwnProperty("type") ? data.type : "perspective";
		if (this.type === "perspective") {
			this._ref = new PerspectiveCamera(
				data.hasOwnProperty("fov") ? data.fov : 60,
				data.hasOwnProperty("aspect")
					? data.aspect
					: System.canvas.width / System.canvas.height,
				data.hasOwnProperty("near") ? data.near : 0.1,
				data.hasOwnProperty("far") ? data.far : 1000
			);
		} else {
			this._ref = new OrthographicCamera(
				data.hasOwnProperty("left") ? data.left : -1,
				data.hasOwnProperty("right") ? data.right : 1,
				data.hasOwnProperty("top") ? data.top : 1,
				data.hasOwnProperty("bottom") ? data.bottom : -1,
				data.hasOwnProperty("near") ? data.near : 0.1,
				data.hasOwnProperty("far") ? data.far : 1000
			);
		}
		this.setViewPort(
			data.hasOwnProperty("viewport")
				? data.viewport
				: new Vector4(0, 0, 1, 1)
		);
		this._enabled = data.hasOwnProperty("enabled") ? data.enabled : true;
		if (this._enabled) {
			this._index = System.camera.cameras.cameras.length;
			System.camera.cameras.cameras.push(this._ref);
		}
	}

	get enabled() {
		return this._enabled;
	}

	set enabled(v) {
		if (v !== this._enabled) {
			this._enabled = v;
			if (this._enabled) {
				this._index = System.camera.cameras.cameras.length;
				System.camera.cameras.cameras.push(this._ref);
			} else {
				System.camera.cameras.cameras.splice(this._index, 1);
			}
		}
	}

	_updateTransform() {
		this._ref.position.copy(this._position);
		this._ref.rotation.copy(this._rotation);
	}

	get aspect() {
		return this._ref.aspect;
	}

	set aspect(v) {
		this._ref.aspect = v;
	}

	get far() {
		return this._ref.far;
	}

	set far(v) {
		this._ref.far = v;
	}

	get filmGauge() {
		return this._ref.filmGauge;
	}

	set filmGauge(v) {
		this._ref.filmGauge = v;
	}

	get filmOffset() {
		return this._ref.filmOffset;
	}

	set filmOffset(v) {
		this._ref.filmOffset = v;
	}

	get focalLength() {
		return this._ref.getFocalLength();
	}

	set focalLength(v) {}

	get focus() {
		return this._ref.focus;
	}

	set focus(v) {
		this._ref.focus = v;
	}

	get fov() {
		return this._ref.fov;
	}

	set fov(v) {
		this._ref.fov = v;
	}

	get near() {
		return this._ref.near;
	}

	set near(v) {
		this._ref.near = v;
	}

	get view() {
		return this._ref.view;
	}

	get zoom() {
		return this._ref.zoom;
	}

	set zoom(v) {
		this._ref.zoom = v;
	}

	get effectiveFOV() {
		return this._ref.getEffectiveFOV();
	}

	get filmHeight() {
		return this._ref.getFilmHeight();
	}

	get filmWidth() {
		return this._ref.getFilmWidth();
	}

	clearViewOffset() {
		this._ref.clearViewOffset();
	}

	setViewOffset(fullWidth, fullHeight, x, y, width, height) {
		this._ref.setViewOffset(fullWidth, fullHeight, x, y, width, height);
	}

	updateProjectionMatrix() {
		this._ref.updateProjectionMatrix();
	}

	getViewport() {
		return this._ref.viewport;
	}

	setViewPort(v) {
		v.x *= System.canvas.width;
		v.y *= System.canvas.height;
		v.z *= System.canvas.width;
		v.w *= System.canvas.height;
		this._ref.viewport = v;
	}
}

const Component = {
	animation: function (id, data) {
		return data;
	},
	behavior: function (id, data) {
		return data;
	},
	camera: Camera,
	collider: Collider,
	object3D: function (id, data = new Object3D()) {
		System.render.scene.add(data);
		return data;
	},
	rigidbody: Rigidbody,
	transform: Transform,
};

Object.defineProperty(Component, "components", {
	enumerable: false,
	value: {},
});
for (const type in Component) Component.components[type] = {};
Component.getComponents = function (type) {
	return this.components[type];
};

export default Component;
