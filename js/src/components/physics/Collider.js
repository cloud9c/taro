import { OIMO } from "../../lib/oimoPhysics.js";
import { Vector3 } from "../../math/Vector3.js";
import { Physics } from "../../Physics.js";

class Collider {
	init(data) {
		if ("_physicsRef" in this.entity) {
			this._ref = this.entity._physicsRef;
		} else {
			Collider._config.type = 1;
			Collider._config.position = Collider._config.position.copyFrom(
				this.entity.transform._position
			);
			Collider._config.rotation = Collider._config.rotation.fromEulerXyz(
				this.entity.transform._rotation
			);
			this.entity._physicsRef = this._ref = new OIMO.RigidBody(
				Collider._config
			);
			Physics._world.addRigidBody(this._ref);
		}
		if ("collider" in this.entity._components) {
			this.entity._components.Collider.push(this);
		} else {
			this.entity._components.Collider = [this];
		}

		this.setShape(data);
	}

	onEnable() {
		this._ref.addShape(this._shapeRef);
	}

	onDisable() {
		this._ref.removeShape(this._shapeRef);
	}

	onDestroy() {
		this._ref;
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

		Collider._shapeConfig.geometry = geometry;
		Collider._shapeConfig.collisionGroup =
			"collisionGroup" in data ? data.collisionGroup : 1;
		Collider._shapeConfig.collisionMask =
			"collisionMask" in data ? data.collisionMask : 1;
		Collider._shapeConfig.contactCallback =
			"contactCallback" in data ? data.contactCallback : null;
		Collider._shapeConfig.density =
			"density" in material ? material.density : 1;
		Collider._shapeConfig.friction =
			"friction" in material ? material.friction : 0.2;
		Collider._shapeConfig.position =
			"localPosition" in data
				? Collider._shapeConfig.position.copyFrom(data.localPosition)
				: Collider._shapeConfig.position.zero();
		Collider._shapeConfig.restitution =
			"restitution" in material ? material.restitution : 0.2;
		Collider._shapeConfig.rotation =
			"localRotation" in data
				? Collider._shapeConfig.rotation.fromEulerXyz(
						data.localRotation
				  )
				: Collider._shapeConfig.rotation.init(
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0
				  );

		if (this._shapeRef !== undefined) {
			this._ref.removeShape(this._shapeRef);
		}
		this._shapeRef = new OIMO.Shape(Collider._shapeConfig);
		this._ref.addShape(this._shapeRef);
	}

	get volume() {
		return this._shapeRef.getGeometry().getVolume();
	}

	getHalfExtents() {
		const v = this._shapeRef.getGeometry().getHalfExtents();
		return new Vector3(v.x, v.y, v.z);
	}

	get halfHeight() {
		return this._shapeRef.getGeometry().getHalfHeight();
	}

	get radius() {
		return this._shapeRef.getGeometry().getRadius();
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
		const aabb = this._shapeRef.getAabb();
		return {
			min: aabb.getMin(),
			max: aabb.getMax(),
		};
	}

	get collisionGroup() {
		return this._shapeRef.getCollisionGroup();
	}

	get collisionMask() {
		return this._shapeRef.getCollisionMask();
	}

	getContactCallback() {
		return this._shapeRef.getContactCallback();
	}

	get density() {
		return this._shapeRef.getDensity();
	}

	get friction() {
		return this._shapeRef.getFriction();
	}

	get restitution() {
		return this._shapeRef.getRestitution();
	}

	getPosition() {
		return this._shapeRef.getLocalTransform().getPosition();
	}

	getRotation() {
		return new Euler().setFromVector3(
			this._shapeRef.getLocalTransform().getRotation().toEulerXyz()
		);
	}

	set collisionGroup(v) {
		this._shapeRef.setCollisionGroup(v);
	}

	set collisionMask(v) {
		this._shapeRef.setCollisionMask(v);
	}

	setContactCallback(v) {
		this._shapeRef.setContactCallback(v);
	}

	set density(v) {
		this._shapeRef.setDensity(v);
	}

	set friction(v) {
		this._shapeRef.setFriction(v);
	}

	setPosition(v) {
		this._shapeRef.setLocalTransform(
			this._shapeRef.getTransform().setPosition(v)
		);
	}

	setRotation(v) {
		this._shapeRef.setLocalTransform(
			this._shapeRef.getTransform().setRotationXyz(v)
		);
	}

	setRestitution(v) {
		this._shapeRef.setRestitution(v);
	}
}
Collider._shapeConfig = new OIMO.ShapeConfig();

Collider._config = new OIMO.RigidBodyConfig();
Collider._config.type = 1;

export { Collider };
