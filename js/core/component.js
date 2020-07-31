import * as THREE from "https://threejs.org/build/three.module.js";
import Entity from "./Entity.js";
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
		const transform = Component.components.Transform[id];
		const obj = Component.components.Object3D[id];
		this.Object3D = obj;
		this.Transform = transform;

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
				position: transform.position.clone(),
				rotation: transform.rotation.clone(),
				scale: transform.scale.clone(),
			},
			vertices: {
				position: transform.position.clone(),
				rotation: transform.rotation.clone(),
				scale: transform.scale.clone(),
			},
			centroid: {
				position: transform.position.clone(),
				rotation: transform.rotation.clone(),
				scale: transform.scale.clone(),
			},
		};
		this.world = {};

		// AABB
		this.world.AABB = new THREE.Box3().setFromObject(obj);

		// add vertices from Convex Hull
		this.world.vertices = [];
		this.vertices = new ConvexHull().setFromObject(
			Asset.getSimplified(obj)
		).vertices;
		for (let i = 0, len = this.vertices.length; i < len; i++) {
			this.vertices[i] = this.vertices[i].point;
			this.world.vertices.push(
				this.vertices[i]
					.clone()
					.applyEuler(transform.rotation)
					.add(transform.position)
					.multiply(transform.scale)
			);
		}

		// add centroid
		const vertLen = this.vertices.length;
		this.centroid = new THREE.Vector3();
		this.world.centroid = [];
		for (var i = 0; i < vertLen; i++) {
			this.centroid.add(this.vertices[i]);
		}
		this.centroid.divideScalar(vertLen);
		this.world.centroid = this.centroid
			.clone()
			.applyEuler(transform.rotation)
			.add(transform.position)
			.multiply(transform.scale);

		// add center of mass to physics
		if (Component.components.Physics.hasOwnProperty(id))
			Component.components.Physics[id].addColliderProperties(this);
	}

	get worldAABB() {
		const cached = this.cached.AABB;
		const transform = this.Transform;
		if (
			!cached.position.equals(transform.position) ||
			!cached.rotation.equals(transform.rotation) ||
			!cached.scale.equals(transform.scale)
		) {
			this.world.AABB.setFromObject(this.Object3D);
			cached.position = transform.position.clone();
			cached.rotation = transform.rotation.clone();
			cached.scale = transform.scale.clone();
		}

		return this.world.AABB;
	}

	get worldVertices() {
		const cached = this.cached.vertices;
		const transform = this.Transform;
		if (
			!cached.position.equals(transform.position) ||
			!cached.rotation.equals(transform.rotation) ||
			!cached.scale.equals(transform.scale)
		) {
			for (let i = 0, len = this.world.vertices.length; i < len; i++) {
				this.world.vertices[i] = this.vertices[i]
					.clone()
					.applyEuler(transform.rotation)
					.add(transform.position)
					.multiply(transform.scale);
			}
			cached.position = transform.position.clone();
			cached.rotation = transform.rotation.clone();
			cached.scale = transform.scale.clone();
		}

		return this.world.vertices;
	}

	get worldCentroid() {
		const cached = this.cached.centroid;
		const transform = this.Transform;
		if (
			!cached.position.equals(transform.position) ||
			!cached.rotation.equals(transform.rotation) ||
			!cached.scale.equals(transform.scale)
		) {
			this.world.centroid = this.centroid
				.clone()
				.applyEuler(transform.rotation)
				.add(transform.position)
				.multiply(transform.scale);

			cached.position = transform.position.clone();
			cached.rotation = transform.rotation.clone();
			cached.scale = transform.scale.clone();
		}
		return this.world.centroid;
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
		if (Component.components.Collider.hasOwnProperty(id))
			this.addColliderProperties(Component.components.Collider[id]);

		this.Transform = Component.components.Transform[id];

		this.currentState = {
			position: this.Transform.position.clone(),
			rotation: this.Transform.rotation.clone(),
		};

		this.previousState = {
			position: new THREE.Vector3(),
			rotation: new THREE.Euler(),
		};
	}

	isMoving() {
		return this.velocity.x != 0 && this.velocity.z != 0;
	}

	isGrounded() {
		return this.velocity.y == 0;
	}

	addColliderProperties(collider) {
		this.centerOfMass = collider.centroid;
		collider.Physics = this;
		this.Collider = collider;

		const size = this.Collider.worldAABB.getSize(new THREE.Vector3());
		const x = size.x;
		const y = size.y;
		const z = size.z;
		this.inertiaTensor = new THREE.Vector3(
			0.083 * this.mass * (y * y + z * z),
			0.083 * this.mass * (x * x + z * z),
			0.083 * this.mass * (y * y + x * x)
		);
	}

	getPointVelocity(worldPoint) {
		return this.velocity
			.clone()
			.add(
				worldPoint
					.clone()
					.sub(this.worldCenterOfMass)
					.cross(this.angularVelocity)
			);
	}

	get worldCenterOfMass() {
		return this.Collider.worldCentroid;
	}
}

function Object3D(id, data = new THREE.Object3D()) {
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

	return data;
}

function setDataComponent(id, type, data) {
	Component.components[type][id] = data;
}

for (const type in Component) {
	Component.components[type] = {};
}

export default Component;
