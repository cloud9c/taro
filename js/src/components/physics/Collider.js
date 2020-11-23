import { OIMO } from "../../lib/oimoPhysics.js";
import { Vector3, Euler } from "../../engine.js";

class Collider {
	start(data) {
		this.setShape(data);

		this.addEventListener("enable", this.onEnable);
		this.addEventListener("disable", this.onDisable);
	}

	onEnable() {
		if ("_physicsRef" in this.entity) {
			this._ref = this.entity._physicsRef;
		} else {
			Collider.config.type = 1;
			this.entity._physicsRef = this._ref = new OIMO.RigidBody(
				Collider.config
			);
			this._ref.entity = this.entity;
			this.entity.scene._physicsWorld.addRigidBody(this._ref);
		}
		this._ref.addShape(this.shapeRef);
		if (this._ref.getType() === 0) {
			const w = this._ref.getMassData();
			w.mass = this._ref._mass;
			this._ref.setMassData(w);
		}
	}

	onDisable() {
		this._ref.removeShape(this.shapeRef);
		if (this._ref.getType() === 0) {
			const w = this._ref.getMassData();
			w.mass = this._ref._mass;
			this._ref.setMassData(w);
		} else if (
			this._ref.getType() === 1 &&
			this._ref.getNumShapes() === 0
		) {
			this.entity.scene._physicsWorld.removeRigidBody(this._ref);
			delete this.entity._physicsRef;
		}
		delete this._ref;
	}

	setShape(data) {
		let geometry;
		switch (data.type) {
			case "box":
				geometry = new OIMO.BoxGeometry(
					"halfExtents" in data ? data.halfExtents : Vector3(1, 1, 1)
				);
				console.log(geometry);
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
				break;
			default:
				throw Error("invalid shape type");
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
		Collider.shapeConfig.restitution =
			"restitution" in material ? material.restitution : 0.2;

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

	set halfExtents(v) {
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

	get contactCallback() {
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

	set collisionGroup(v) {
		this.shapeRef.setCollisionGroup(v);
	}

	set collisionMask(v) {
		this.shapeRef.setCollisionMask(v);
	}

	set contactCallback(v) {
		this.shapeRef.setContactCallback(v);
	}

	set density(v) {
		this.shapeRef.setDensity(v);
	}

	set friction(v) {
		this.shapeRef.setFriction(v);
	}

	setRestitution(v) {
		this.shapeRef.setRestitution(v);
	}
}
Collider.shapeConfig = new OIMO.ShapeConfig();

Collider.config = new OIMO.RigidBodyConfig();
Collider.config.type = 1;

export { Collider };
