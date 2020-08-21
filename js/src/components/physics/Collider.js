import { OIMO } from "../../lib/oimoPhysics.js";
import { Vector3 } from "../../math/Vector3.js";
import { Physics } from "../../Physics.js";

class Collider {
	init(data) {
		if ("_physicsRef" in this.entity) {
			this._ref = this.entity._physicsRef;
		} else {
			Collider.config.type = 1;
			Collider.config.position = Collider.config.position.copyFrom(
				this.entity.transform._position
			);
			Collider.config.rotation = Collider.config.rotation.fromEulerXyz(
				this.entity.transform._rotation
			);
			this.entity._physicsRef = this._ref = new OIMO.RigidBody(
				Collider.config
			);
			Physics._world.addRigidBody(this._ref);
		}
		if ("collider" in this.entity.components) {
			this.entity.components.Collider.push(this);
		} else {
			this.entity.components.Collider = [this];
		}

		this.setShape(data);
	}

	onEnable() {
		this._ref.addShape(this.shapeRef);
	}

	onDisable() {
		this._ref.removeShape(this.shapeRef);
	}

	setShape(data) {
		let geometry;
		switch (data.type) {
			case "box":
				geometry = new OIMO.BoxGeometry(
					"halfExtents" in data ? data.halfExtents : Vector3(1, 1, 1)
				);
				break;
			case "capsule":
				geometry = new OIMO.CapsuleGeometry(
					"radius" in data ? data.radius : 0.5,
					"halfHeight" in data ? data.halfHeight : 1
				);
				break;
			case "cone":
				geometry = new OIMO.ConeGeometry(
					"radius" in data ? data.radius : 0.5,
					"halfHeight" in data ? data.halfHeight : 1
				);
				break;
			case "cylinder":
				geometry = new OIMO.CylinderGeometry(
					"radius" in data ? data.radius : 0.5,
					"halfHeight" in data ? data.halfHeight : 1
				);
				break;
			case "mesh":
				// geometry = new OIMO.ConvexHullGeometry(
				// 	"radius" in data ? data.radius : 0.5
				// );
				break;
			case "sphere":
				geometry = new OIMO.SphereGeometry(
					"radius" in data ? data.radius : 0.5
				);
		}

		const material = "material" in data ? data.material : {};

		Collider.shapeConfig.geometry = geometry;
		Collider.shapeConfig.collisionGroup =
			"collisionGroup" in data ? data.collisionGroup : 1;
		Collider.shapeConfig.collisionMask =
			"collisionMask" in data ? data.collisionMask : 1;
		Collider.shapeConfig.contactCallback =
			"contactCallback" in data ? data.contactCallback : null;
		Collider.shapeConfig.density =
			"density" in material ? material.density : 1;
		Collider.shapeConfig.friction =
			"friction" in material ? material.friction : 0.2;
		Collider.shapeConfig.position =
			"localPosition" in data
				? Collider.shapeConfig.position.copyFrom(data.localPosition)
				: Collider.shapeConfig.position.zero();
		Collider.shapeConfig.restitution =
			"restitution" in material ? material.restitution : 0.2;
		Collider.shapeConfig.rotation =
			"localRotation" in data
				? Collider.shapeConfig.rotation.fromEulerXyz(data.localRotation)
				: Collider.shapeConfig.rotation.init(0, 0, 0, 0, 0, 0, 0, 0, 0);

		if (this.shapeRef !== undefined) {
			this._ref.removeShape(this.shapeRef);
			this.shapeRef = new OIMO.Shape(Collider.shapeConfig);
			this._ref.addShape(this.shapeRef);
		} else {
			this.shapeRef = new OIMO.Shape(Collider.shapeConfig);
		}
	}

	get volume() {
		return this.shapeRef.getGeometry().getVolume();
	}

	getHalfExtents() {
		const v = this.shapeRef.getGeometry().getHalfExtents();
		return new Vector3(v.x, v.y, v.z);
	}

	get halfHeight() {
		return this.shapeRef.getGeometry().getHalfHeight();
	}

	get radius() {
		return this.shapeRef.getGeometry().getRadius();
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
		const aabb = this.shapeRef.getAabb();
		return {
			min: aabb.getMin(),
			max: aabb.getMax(),
		};
	}

	get collisionGroup() {
		return this.shapeRef.getCollisionGroup();
	}

	get collisionMask() {
		return this.shapeRef.getCollisionMask();
	}

	getContactCallback() {
		return this.shapeRef.getContactCallback();
	}

	get density() {
		return this.shapeRef.getDensity();
	}

	get friction() {
		return this.shapeRef.getFriction();
	}

	get restitution() {
		return this.shapeRef.getRestitution();
	}

	getPosition() {
		return this.shapeRef.getLocalTransform().getPosition();
	}

	getRotation() {
		return new Euler().setFromVector3(
			this.shapeRef.getLocalTransform().getRotation().toEulerXyz()
		);
	}

	set collisionGroup(v) {
		this.shapeRef.setCollisionGroup(v);
	}

	set collisionMask(v) {
		this.shapeRef.setCollisionMask(v);
	}

	setContactCallback(v) {
		this.shapeRef.setContactCallback(v);
	}

	set density(v) {
		this.shapeRef.setDensity(v);
	}

	set friction(v) {
		this.shapeRef.setFriction(v);
	}

	setPosition(v) {
		this.shapeRef.setLocalTransform(
			this.shapeRef.getTransform().setPosition(v)
		);
	}

	setRotation(v) {
		this.shapeRef.setLocalTransform(
			this.shapeRef.getTransform().setRotationXyz(v)
		);
	}

	setRestitution(v) {
		this.shapeRef.setRestitution(v);
	}
}
Collider.shapeConfig = new OIMO.ShapeConfig();

Collider.config = new OIMO.RigidBodyConfig();
Collider.config.type = 1;

export { Collider };
