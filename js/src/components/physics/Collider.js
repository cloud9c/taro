import { OIMO } from "../../lib/oimoPhysics.js";
import { Vector3, Euler } from "../../engine.js";

const shapeConfig = new OIMO.ShapeConfig();
shapeConfig.contactCallback = {
	beginContact: (c) => contactCallback(c, "collisionenter"),
	preSolve: (c) => contactCallback(c, "collisionpresolve"),
	postSolve: (c) => contactCallback(c, "collisionpostsolve"),
	endContact: (c) => contactCallback(c, "collisionend"),
};

const config = new OIMO.RigidBodyConfig();
config.type = 1;

class Collider {
	start(data) {
		this.setShape(data);

		this.addEventListener("enable", this.onEnable);
		this.addEventListener("disable", this.onDisable);
	}

	onEnable() {
		if ("_physicsRef" in this.entity) {
			const ref = this.entity._physicsRef;
			this._ref = ref;
			if (!ref.component._enabled) {
				this.entity.scene._physicsWorld.addRigidBody(this._ref);
			}
		} else {
			config.position = this.entity.getWorldPosition(vector);
			config.rotation.fromQuat(this.entity.getWorldQuaternion(quat));
			this.entity._physicsRef = this._ref = new OIMO.RigidBody(config);
			this.entity.scene._physicsWorld.addRigidBody(this._ref);
			this._ref.component = this;
			this._ref.entity = this.entity;
		}
		this._ref.addShape(this._shapeRef);
		if (this._ref.getType() === 0) {
			const w = this._ref.getMassData();
			w.mass = this._ref._mass;
			this._ref.setMassData(w);
		}
	}

	onDisable() {
		this._ref.removeShape(this._shapeRef);
		if (this._ref.getType() === 0) {
			const w = this._ref.getMassData();
			w.mass = this._ref._mass;
			this._ref.setMassData(w);
		}
		if (this._ref.getNumShapes() === 0) {
			this.entity.scene._physicsWorld.removeRigidBody(this._ref);
		}
		delete this._ref;
	}

	setShape(data) {
		let geometry;
		if (!("type" in data)) data.type = box;
		switch (data.type) {
			case "box":
				geometry = new OIMO.BoxGeometry(
					"halfExtents" in data
						? data.halfExtents
						: new Vector3(1, 1, 1)
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
				break;
			default:
				throw Error("invalid shape type");
		}

		shapeConfig.geometry = geometry;
		shapeConfig.collisionGroup =
			"collisionGroup" in data ? data.collisionGroup : 1;
		shapeConfig.collisionMask =
			"collisionMask" in data ? data.collisionMask : 1;

		if (this._shapeRef !== undefined) {
			this._ref.removeShape(this._shapeRef);
			this._shapeRef = new OIMO.Shape(shapeConfig);
			this._ref.addShape(this._shapeRef);
		} else {
			this._shapeRef = new OIMO.Shape(shapeConfig);
		}
		this._shapeRef.entity = this.entity;
		this._shapeRef.collider = this;

		if ("material" in data) this.material = data.material;
	}

	get material() {
		return this._material;
	}

	set material(material) {
		if (material === null) {
			this._shapeRef.setFriction(0.2);
			this._shapeRef.setRestitution(0.2);
		}

		if ("_material" in this) {
			const colliders = this._material._colliders;
			colliders.splice(colliders.indexOf(this._shapeRef), 1);
		}
		material._colliders.push(this._shapeRef);
		this._shapeRef.setFriction(material._friction);
		this._shapeRef.setRestitution(material._restitution);
		this._material = material;
	}

	get volume() {
		return this._shapeRef.getGeometry().getVolume();
	}

	get halfExtents() {
		const v = this._shapeRef.getGeometry().getHalfExtents();
		return new Vector3(v.x, v.y, v.z);
	}

	get halfHeight() {
		return this._shapeRef.getGeometry().getHalfHeight();
	}

	get radius() {
		return this._shapeRef.getGeometry().getRadius();
	}

	set halfExtents(v) {
		this.setShape({
			type: this.type,
			halfExtents: v,
			collisionGroup: this.collisionGroup,
			collisionMask: this.collisionMask,
			material: this.material,
		});
	}

	set halfHeight(v) {
		this.setShape({
			type: this.type,
			halfHeight: v,
			collisionGroup: this.collisionGroup,
			collisionMask: this.collisionMask,
			material: this.material,
		});
	}

	set radius(v) {
		this.setShape({
			type: this.type,
			radius: v,
			collisionGroup: this.collisionGroup,
			collisionMask: this.collisionMask,
			material: this.material,
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

	set collisionGroup(v) {
		this._shapeRef.setCollisionGroup(v);
	}

	set collisionMask(v) {
		this._shapeRef.setCollisionMask(v);
	}
}

function contactCallback(contact, type) {
	const constraint = contact.getContactConstraint();
	const entity1 = constraint.getShape1().entity;
	const entity2 = constraint.getShape2().entity;

	const has1 = entity1.hasEventListener(type, contactCallback);
	const has2 = entity2.hasEventListener(type, contactCallback);

	if (has1 || has2) {
		const collider1 = constraint.getShape1().collider;
		const collider2 = constraint.getShape2().collider;

		const binormal = new Vector3();
		const normal = new Vector3();
		const tangent = new Vector3();
		const manifold = contact.getManifold();
		manifold.getBinormalTo(binormal);
		manifold.getNormalTo(normal);
		manifold.getTangentTo(tangent);

		const contacts = manifold.getPoints();
		for (let i = 0, len = contacts.length; i < len; i++) {
			const point = new Vector3();
			const contact = contacts[i];
			contact.getPosition1To(point);

			contact.binormalImpulse = contact.getBinormalImpulse();
			contact.depthImpulse = contact.getDepth();
			contact.normalImpulse = contact.getNormalImpulse();
			contact.tangentImpulse = contact.getTangentImpulse();
			contact.point = point;
		}

		const obj = {
			type,
			entity: entity2,
			thisCollider: collider1,
			otherCollider: collider2,
			binormal,
			normal,
			tangent,
			contacts,
		};
		if (has1 && has2) {
			entity1.dispatchEvent(obj);
			obj.entity = entity1;
			obj.thisCollider = collider2;
			obj.thisCollider = collider1;
			entity2.dispatchEvent(obj);
		} else if (has1) {
			entity1.dispatchEvent(obj);
		} else {
			obj.entity = entity1;
			obj.thisCollider = collider2;
			obj.thisCollider = collider1;
			entity2.dispatchEvent(obj);
		}
	}
}

export { Collider };
