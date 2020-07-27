import * as THREE from "https://threejs.org/build/three.module.js";
import System from "./System.js";
import Asset from "./Asset.js";
import { ConvexHull } from "https://threejs.org/examples/jsm/math/ConvexHull.js";
const Component = {
	components: {},
	Animation: setDataComponent,
	Behavior: setDataComponent,
	Collider: (id, type, data) => {
		setDataComponent(id, type, new Collider(id, data));
	},
	Interactable: setDataComponent,
	Object3D: (id, type, data) => {
		setDataComponent(id, type, Object3D(id, data));
	},
	Physics: (id, type, data) => {
		setDataComponent(id, type, new Physics(id, data));
	},
	Transform: (id, type, data) => {
		setDataComponent(id, type, Transform(id, data));
	},
};

class Collider {
	constructor(id, data) {
		const obj = Component.components.Object3D[id];
		this.Object3D = obj;

		this.onCollisionEnter = data.hasOwnProperty("onCollisionEnter")
			? data.onCollisionEnter
			: null;
		this.onCollisionExit = data.hasOwnProperty("onCollisionExit")
			? data.onCollisionExit
			: null;
		this.material = data.hasOwnProperty("material") ? data.material : {};
		this.material.dynamicFriction = this.material.hasOwnProperty(
			"dynamicFriction"
		)
			? this.material.dynamicFriction
			: 0.6;
		this.material.staticFriction = this.material.hasOwnProperty(
			"staticFriction"
		)
			? this.material.staticFriction
			: 0.6;
		this.material.bounciness = this.material.hasOwnProperty("bounciness")
			? this.material.bounciness
			: 0;

		// create cached convex hull and box3
		this.cached = {
			AABB: {
				updated: false,
				position: obj.position.clone(),
				rotation: obj.rotation.clone(),
				scale: obj.scale.clone(),
			},
			vertices: {
				updated: false,
				position: obj.position.clone(),
				rotation: obj.rotation.clone(),
				scale: obj.scale.clone(),
			},
			centroid: {
				updated: false,
				position: obj.position.clone(),
				rotation: obj.rotation.clone(),
				scale: obj.scale.clone(),
			},
		};
		this.world = {};

		// AABB
		this.world.AABB = new THREE.Box3();

		// Convex Hull
		this.convexHull = new ConvexHull().setFromObject(
			Asset.getSimplified(obj)
		);
		this.volume = 0;
		for (let i = 0, len = this.convexHull.faces.length; i < len; i++) {
			const face = this.convexHull.faces[i];
			this.volume += face.edge.vertex.point.dot(face.normal) * face.area;
		}
		this.volume /= 3;

		// add vertices
		this.world.vertices = [];
		this.vertices = this.convexHull.vertices;
		for (let i = 0, len = this.vertices.length; i < len; i++) {
			this.vertices[i] = this.vertices[i].point;
		}

		// add centroid
		const vertLen = this.vertices.length;
		this.centroid = new THREE.Vector3();
		for (var i = 0; i < vertLen; i++) {
			this.centroid.add(this.vertices[i]);
		}
		this.centroid.divideScalar(vertLen);
		this.world.centroid = [];

		// add center of mass to physics
		if (Component.components.Physics.hasOwnProperty(id)) {
			this.Physics = Component.components.Physics[id];
			this.Physics.centerOfMass = this.centroid;
			this.Physics.worldCenterOfMass = this.worldCentroid;
			this.Physics.volume = this.volume;
		}
	}

	get worldAABB() {
		const cached = this.cached.AABB;
		const obj = this.Object3D;
		if (!cached.updated) {
			// TODO! can optimize to transform diff rather than setFromObject each time

			if (
				!cached.position.equals(obj.position) ||
				!cached.rotation.equals(obj.rotation) ||
				!cached.scale.equals(obj.scale)
			) {
				this.world.AABB.setFromObject(obj);
				cached.position = obj.position.clone();
				cached.rotation = obj.rotation.clone();
				cached.scale = obj.scale.clone();
			}
			cached.updated = true;
		}

		return this.world.AABB;
	}

	get worldVertices() {
		const cached = this.cached.vertices;
		const obj = this.Object3D;
		if (!cached.updated) {
			// TODO! can optimize to transform diff rather than clone origin each time

			if (
				!cached.position.equals(obj.position) ||
				!cached.rotation.equals(obj.rotation) ||
				!cached.scale.equals(obj.scale)
			) {
				for (
					let i = 0, len = this.world.vertices.length;
					i < len;
					i++
				) {
					this.world.vertices[i] = this.vertices[i]
						.clone()
						.applyEuler(obj.rotation)
						.add(obj.position)
						.multiply(obj.scale);
				}
				cached.position = obj.position.clone();
				cached.rotation = obj.rotation.clone();
				cached.scale = obj.scale.clone();
			}

			cached.updated = true;
		}

		return this.world.vertices;
	}

	get worldCentroid() {
		const cached = this.cached.centroid;
		const obj = this.Object3D;
		if (!cached.updated) {
			if (
				!cached.position.equals(obj.position) ||
				!cached.rotation.equals(obj.rotation) ||
				!cached.scale.equals(obj.scale)
			) {
				for (let i = 0, len = this.centroid.length; i < len; i++) {
					this.world.centroid[i] = this.centroid[i]
						.clone()
						.applyEuler(obj.rotation)
						.add(obj.position)
						.multiply(obj.scale);
				}

				cached.position = obj.position.clone();
				cached.rotation = obj.rotation.clone();
				cached.scale = obj.scale.clone();
			}
			cached.updated = true;
		}
		return this.world.centroid;
	}

	resetUpdate() {
		this.cached.AABB.updated = false;
		this.cached.vertices.updated = false;
		this.cached.centroid.updated = false;
	}
}

class Physics {
	constructor(id, data) {
		this.velocity = data.hasOwnProperty("velocity")
			? data.velocity
			: new THREE.Vector3();
		this.angularVelocity = data.hasOwnProperty("angularVelocity")
			? data.angularVelocity
			: new THREE.Vector3();
		this.mass = data.hasOwnProperty("mass") ? data.mass : 1;
		this.useGravity = data.hasOwnProperty("useGravity")
			? data.useGravity
			: true;

		// add collider properties to physics
		if (Component.components.Collider.hasOwnProperty(id)) {
			this.Collider = Component.components.Collider[id];
			this.centerOfMass = this.Collider.centroid;
			this.worldCenterOfMass = this.Collider.worldCentroid;
			this.volume = this.Collider.volume;
		}
	}

	isMoving() {
		return this.velocity.x != 0 && this.velocity.z != 0;
	}

	isGrounded() {
		return this.velocity.y == 0;
	}
}

function Object3D(id, data = new THREE.Object3D()) {
	const transform = Component.components.Transform[id];
	if (transform) {
		transform.position = data.position;
		transform.rotation = data.rotation;
		transform.scale = data.scale;
	}
	System.render.scene.add(data);
	return data;
}

function Transform(id, data) {
	data.position = data.hasOwnProperty("position")
		? data.position
		: new THREE.Vector3();
	data.rotation = data.hasOwnProperty("rotation")
		? data.rotation
		: new THREE.Euler();
	data.scale = data.hasOwnProperty("scale")
		? data.scale
		: new THREE.Vector3(1, 1, 1);

	const object = Component.components.Object3D[id];
	if (object) {
		data.position = object.position.copy(data.position);
		data.rotation = object.rotation.copy(data.rotation);
		data.scale = object.scale.copy(data.scale);
	}
	return data;
}

function setDataComponent(id, type, data) {
	Component.components[type][id] = data;
}

for (const type in Component) {
	Component.components[type] = {};
}

export default Component;
