import { OIMO } from "./lib/oimoPhysics.js";
import { Vector3 } from "./Engine.js";
import { System } from "../System.js";

class Collider {
	setRef() {
		if (this.entity.hasOwnProperty("_physicsRef")) {
			this._ref = this.entity._physicsRef;
		} else {
			Collider._config.position = Collider._config.position.copyFrom(
				this.entity.transform._position
			);
			Collider._config.rotation = Collider._config.rotation.fromEulerXyz(
				this.entity.transform._rotation
			);
			this.entity._physicsRef = this._ref = new OIMO.RigidBody(
				Collider._config
			);
			System.world.addRigidBody(this._ref);
		}
	}

	setShape(data) {
		let geometry;
		switch (data.type) {
			case "box":
				geometry = new OIMO.BoxGeometry(
					data.hasOwnProperty("halfExtents")
						? data.halfExtents
						: Vector3(1, 1, 1)
				);
				break;
			case "capsule":
				geometry = new OIMO.CapsuleGeometry(
					data.hasOwnProperty("radius") ? data.radius : 0.5,
					data.hasOwnProperty("halfHeight") ? data.halfHeight : 1
				);
				break;
			case "cone":
				geometry = new OIMO.ConeGeometry(
					data.hasOwnProperty("radius") ? data.radius : 0.5,
					data.hasOwnProperty("halfHeight") ? data.halfHeight : 1
				);
				break;
			case "cylinder":
				geometry = new OIMO.CylinderGeometry(
					data.hasOwnProperty("radius") ? data.radius : 0.5,
					data.hasOwnProperty("halfHeight") ? data.halfHeight : 1
				);
				break;
			case "mesh":
				// geometry = new OIMO.ConvexHullGeometry(
				// 	data.hasOwnProperty("radius") ? data.radius : 0.5
				// );
				break;
			case "sphere":
				geometry = new OIMO.SphereGeometry(
					data.hasOwnProperty("radius") ? data.radius : 0.5
				);

			default:
				throw "Invalid shape type";
		}

		const material = data.hasOwnProperty("material") ? data.material : {};

		Shape._config.geometry = geometry;
		Shape._config.collisionGroup = data.hasOwnProperty("collisionGroup")
			? data.collisionGroup
			: 1;
		Shape._config.collisionMask = data.hasOwnProperty("collisionMask")
			? data.collisionMask
			: 1;
		Shape._config.contactCallback = data.hasOwnProperty("contactCallback")
			? data.contactCallback
			: null;
		Shape._config.density = material.hasOwnProperty("density")
			? material.density
			: 1;
		Shape._config.friction = material.hasOwnProperty("friction")
			? material.friction
			: 0.2;
		Shape._config.position = data.hasOwnProperty("localPosition")
			? Shape._config.position.copyFrom(data.localPosition)
			: Shape._config.position.zero();
		Shape._config.restitution = material.hasOwnProperty("restitution")
			? material.restitution
			: 0.2;
		Shape._config.rotation = data.hasOwnProperty("localRotation")
			? Shape._config.rotation.fromEulerXyz(data.localRotation)
			: Shape._config.rotation.init(0, 0, 0, 0, 0, 0, 0, 0, 0);

		this._ref.addShape(new OIMO.Shape(Shape._config));
	}

	recompute() {
		switch (this._ref.getType()) {
			case 0:
				break;
			case 1:
			case 2:
			case 3:
				break;
			case 4:
				break;
			case 5:
				break;
		}
	}

	get volume() {
		return this._ref.getGeometry().getVolume();
	}

	getHalfExtents() {
		const v = this._ref.getGeometry().getHalfExtents();
		return new Vector3(v.x, v.y, v.z);
	}

	get halfHeight() {
		return this._ref.getGeometry().getHalfHeight();
	}

	get radius() {
		return this._ref.getGeometry().getRadius();
	}

	setHalfExtents(v) {
		this.setShape({
			type: this.type,
			halfExtents: v,
			collisionGroup: this.collisionGroup,
			collisionMask: this.collisionMask,
			contactCallback: this.contactCallback,
			density: this.density,
			friction: this.friction,
			localPosition: this.getLocalPosition(),
			restitution: this.restitution,
			localRotation: this.getLocalRotation(),
		});
	}

	set halfHeight(v) {
		this.setShape({
			type: this.type,
			halfHeight: v,
			collisionGroup: this.collisionGroup,
			collisionMask: this.collisionMask,
			contactCallback: this.contactCallback,
			density: this.density,
			friction: this.friction,
			localPosition: this.getLocalPosition(),
			restitution: this.restitution,
			localRotation: this.getLocalRotation(),
		});
	}

	set radius(v) {
		this.setShape({
			type: this.type,
			radius: v,
			collisionGroup: this.collisionGroup,
			collisionMask: this.collisionMask,
			contactCallback: this.contactCallback,
			density: this.density,
			friction: this.friction,
			localPosition: this.getLocalPosition(),
			restitution: this.restitution,
			localRotation: this.getLocalRotation(),
		});
	}

	get bounds() {
		const aabb = this._ref.getAabb();
		return {
			min: aabb.getMin(),
			max: aabb.getMax(),
		};
	}

	get collisionGroup() {
		return this._ref.getCollisionGroup();
	}

	get collisionMask() {
		return this._ref.getCollisionMask();
	}

	getContactCallback() {
		return this._ref.getContactCallback();
	}

	get density() {
		return this._ref.getDensity();
	}

	get friction() {
		return this._ref.getFriction();
	}

	get restitution() {
		return this._ref.getRestitution();
	}

	getPosition() {
		return this._ref.getLocalTransform().getPosition();
	}

	getRotation() {
		return new Euler().setFromVector3(
			this._ref.getLocalTransform().getRotation().toEulerXyz()
		);
	}

	set collisionGroup(v) {
		this._ref.setCollisionGroup(v);
	}

	set collisionMask(v) {
		this._ref.setCollisionMask(v);
	}

	setContactCallback(v) {
		this._ref.setContactCallback(v);
	}

	set density(v) {
		this._ref.setDensity(v);
	}

	set friction(v) {
		this._ref.setFriction(v);
	}

	setPosition(v) {
		this._ref.setLocalTransform(this._ref.getTransform().setPosition(v));
	}

	setRotation(v) {
		this._ref.setLocalTransform(this._ref.getTransform().setRotationXyz(v));
	}

	setRestitution(v) {
		this._ref.setRestitution(v);
	}
}
Collider._shapeConfig = new OIMO.ShapeConfig();

Collider._config = new OIMO.RigidBodyConfig();
Collider._config.type = 1;

export { Collider };
