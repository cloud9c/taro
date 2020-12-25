import { OIMO } from "../../lib/oimo.js";
import { Vector3, Euler, Quaternion } from "../../engine.js";
import { ConvexHull } from "../../physics/ConvexHull.js";

const vector = new Vector3();
const vector2 = new Vector3();
const quat = new Quaternion();
const convexHull = new ConvexHull();
const massData = new OIMO.MassData();
const transform = new OIMO.Transform();
const shapeConfig = new OIMO.ShapeConfig();
shapeConfig.contactCallback = {
	beginContact: (c) => contactCallback(c, "collisionenter"),
	preSolve: (c) => contactCallback(c, "collisionpresolve"),
	postSolve: (c) => contactCallback(c, "collisionpostsolve"),
	endContact: (c) => contactCallback(c, "collisionend"),
};

const config = new OIMO.RigidBodyConfig();
config.type = 1;

const proxyHandler = {
	set: function (target, prop, value, receiver) {
		target[prop] = value;
		const colliders = target.colliders;
		for (let i = 0, len = colliders.length; i < len; i++) {
			colliders[i]._setShape();
		}
		return true;
	},
};

export class Collider {
	start(data) {
		this._isTrigger = "isTrigger" in data ? data.isTrigger : false;
		this._collisionGroup =
			"collisionGroup" in data ? data.collisionGroup : 1;
		this._collisionMask = "collisionMask" in data ? data.collisionMask : 1;
		this._center = "center" in data ? data.center : new Vector3(0, 0, 0);
		this._rotation = "rotation" in data ? data.center : new Euler(0, 0, 0);
		switch (this.type) {
			case "box":
				// box
				this._halfExtents =
					"halfExtents" in data
						? data.halfExtents
						: new Vector(1, 1, 1);
			case "sphere":
				this._radius = "radius" in data ? data.radius : 0.5;
				break;
			case "capsule":
			case "cone":
			case "cylinder":
				this._radius = "radius" in data ? data.radius : 0.5;
				this._halfHeight = "halfHeight" in data ? data.halfHeight : 1;

				break;
			case "mesh":
				this._mesh = "mesh" in data ? data.mesh : null;
		}
		if ("material" in data) this._material = data.material;
		this._setShape();

		this.addEventListener("enable", this.onEnable);
		this.addEventListener("disable", this.onDisable);
		this.entity.addEventListener("scenechange", this.onSceneChange);
	}

	onEnable() {
		if (this._isTrigger) {
			this.entity.scene.app.physics._triggers.push(this._shapeRef);
		} else {
			if ("_physicsRef" in this.entity) {
				const ref = this.entity._physicsRef;
				this._ref = ref;
				if (!ref.component._enabled) {
					this.entity.scene._physicsWorld.addRigidBody(this._ref);
				}
			} else {
				this.entity.matrixWorld.decompose(vector, quat, vector2);
				config.position = vector;
				config.rotation.fromQuat(quat);
				this.entity._physicsRef = this._ref = new OIMO.RigidBody(
					config
				);

				this.entity.scene._physicsWorld.addRigidBody(this._ref);
				this._ref.component = this;
				this._ref.entity = this.entity;
			}
			this._ref.addShape(this._shapeRef);
			if (this._ref.getType() === 0) {
				this._ref.getMassDataTo(massData);
				massData.mass = this._ref.mass;
				this._ref.setMassData(massData);
			}
		}

		const scale = this.entity.scale;
		if ("colliders" in scale) {
			scale.colliders.push(this);
		} else {
			scale.colliders = [this];
			Object.defineProperty(this.entity, "scale", {
				value: new Proxy(scale, proxyHandler),
			});
		}
	}

	onDisable() {
		if (this._isTrigger) {
			const triggers = this.entity.scene.physics._triggers;
			triggers.splice(triggers.indexOf(this._shapeRef), 1);
		} else {
			this._ref.removeShape(this._shapeRef);
			if (this._ref.getType() === 0) {
				this._ref.getMassDataTo(massData);
				massData.mass = this._ref.mass;
				this._ref.setMassData(massData);
			}
			if (this._ref.getNumShapes() === 0 && this._ref.getType() === 1) {
				this.entity.scene._physicsWorld.removeRigidBody(this._ref);
			}
			delete this._ref;
			const scale = this.entity.scale;
			if (scale.colliders.length === 1) {
				Object.defineProperty(this.entity, "scale", {
					value: new Vector3().copy(scale),
				});
			} else {
				scale.colliders.splice(scale.colliders.indexOf(this), 1);
			}
		}
	}

	onSceneChange(event) {
		// need to test
		if (this._enabled) {
			if (this._isTrigger) {
				const oldTriggers = event.oldScene.physics._triggers;
				oldTriggers.splice(oldTriggers.indexOf(this._shapeRef), 1);
				event.newScene.physics._triggers.push(this._shapeRef);
			} else {
				this._ref.removeShape(this._shapeRef);
				if (
					this._ref.getNumShapes() === 0 &&
					this._ref.getType() === 1
				) {
					event.oldScene._physicsWorld.removeRigidBody(this._ref);
					event.newScene._physicsWorld.addRigidBody(this._ref);
				}
			}
		}
	}

	_setShape() {
		let geometry;
		const scale = this.entity.scale;
		const max = Math.max(scale.x, scale.y, scale.z);
		switch (this.type) {
			case "box":
				geometry = new OIMO.BoxGeometry(
					vector.copy(this._halfExtents).multiply(scale)
				);
				break;
			case "sphere":
				geometry = new OIMO.SphereGeometry(this._radius * max);
				break;
			case "capsule":
				geometry = new OIMO.CapsuleGeometry(
					this._radius * max,
					this._halfHeight * max
				);
				break;
			case "cone":
				geometry = new OIMO.ConeGeometry(
					this._radius * max,
					this._halfHeight * max
				);
				break;
			case "cylinder":
				geometry = new OIMO.CylinderGeometry(
					this._radius * max,
					this._halfHeight * max
				);
				break;
			case "mesh":
				let vertices = [];
				if (this._mesh !== null) {
					vertices = convexHull.setFromObject(this._mesh).vertices;
					for (let i = 0, len = vertices.length; i < len; i++) {
						vertices[i] = vertices[i].point.multiply(scale);
					}
				}
				geometry = new OIMO.ConvexHullGeometry(vertices);
		}

		shapeConfig.geometry = geometry;
		shapeConfig.collisionGroup = this._collisionGroup;
		shapeConfig.collisionMask = this._collisionMask;
		shapeConfig.position = this._center;
		shapeConfig.rotation.fromEulerXyz(this._rotation);

		if ("_shapeRef" in this && this._enabled) {
			if (this._isTrigger) {
				const triggers = this.entity.scene.physics._triggers;
				triggers.splice(triggers.indexOf(this._shapeRef), 1);
				this._shapeRef = new OIMO.Shape(shapeConfig);
				triggers.push(this._shapeRef);
			} else {
				this._ref.removeShape(this._shapeRef);
				this._shapeRef = new OIMO.Shape(shapeConfig);
				this._ref.addShape(this._shapeRef);
			}
		} else {
			this._shapeRef = new OIMO.Shape(shapeConfig);
		}

		this._shapeRef.entity = this.entity;
		this._shapeRef.collider = this;

		if ("_material" in this) this.material = this._material;
	}

	get isTrigger() {
		return this._isTrigger;
	}

	set isTrigger(isTrigger) {
		this.onDisable();
		this._isTrigger = isTrigger;
		this.onEnable();
	}

	get center() {
		return this._center;
	}

	set center(center) {
		this._center = center;
		this._shapeRef.getLocalTransformTo(transform);
		transform.setPosition(center);
		this._shapeRef.setLocalTransform(transform);
	}

	get rotation() {
		return this._rotation;
	}

	set rotation(rotation) {
		this._rotation = rotation;
		this._shapeRef.getLocalTransformTo(transform);
		transform.setRotationXyz(rotation);
		this._shapeRef.setLocalTransform(transform);
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

	get mesh() {
		return this._mesh;
	}

	set mesh(v) {
		this._mesh = v;
		this._setShape();
	}

	get halfExtents() {
		return this._halfHeight;
	}

	get halfHeight() {
		return this._halfHeight;
	}

	get radius() {
		return this._radius;
	}

	set halfExtents(v) {
		this._halfExtents = v;
		this._setShape();
	}

	set halfHeight(v) {
		this._halfHeight = v;
		this._setShape();
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
		return this._collisionGroup;
	}

	get collisionMask() {
		return this._collisionMask;
	}

	set collisionGroup(v) {
		this._collisionGroup = v;
		this._shapeRef.setCollisionGroup(v);
	}

	set collisionMask(v) {
		this._collisionMask = v;
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
