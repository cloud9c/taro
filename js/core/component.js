import * as THREE from 'https://threejs.org/build/three.module.js';
import System from './System.js';
import Asset from './Asset.js'
import { ConvexHull } from 'https://threejs.org/examples/jsm/math/ConvexHull.js';
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
		setDataComponent(id, type, new Physics(data));
	},
	Transform: (id, type, data) => {
		setDataComponent(id, type, Transform(id, data));
	}
};

class Collider {
	constructor(id, data) {
		const obj = Component.components.Object3D[id];

		this.isTrigger = data.hasOwnProperty('isTrigger') ? data.isTrigger : false;
		this.material = data.hasOwnProperty('material') ? data.material : {};
		this.material.dynamicFriction = this.material.hasOwnProperty('dynamicFriction') ? this.material.dynamicFriction : 0.6;
		this.material.staticFriction = this.material.hasOwnProperty('staticFriction') ? this.material.staticFriction : 0.6;
		this.material.bounciness = this.material.hasOwnProperty('bounciness') ? this.material.bounciness : 0;

		// create cached convex hull and box3
		this.cached = {
			AABB: {
				updated: false,
				position: obj.position.clone(),
				rotation: obj.rotation.clone(),
				scale: obj.scale.clone()
			},
			vertices: {
				updated: false,
				position: obj.position.clone(),
				rotation: obj.rotation.clone(),
				scale: obj.scale.clone()
			}
		};
		this.AABB = new THREE.Box3().setFromObject(obj);

		const origin = new ConvexHull().setFromObject(Asset.getSimplified(obj)).vertices;

		this.vertices = [];
		for (let i = 0, len = origin.length; i < len; i++) {
			origin[i] = origin[i].point;
			this.vertices.push(origin[i].clone().applyEuler(obj.rotation).add(obj.position).multiply(obj.scale));
		}
		this.cached.vertices.origin = origin;

		// add centroid
		const vertLen = this.vertices.length;
		this.centroid = new THREE.Vector3();
		for (var i = 0; i < vertLen; i++) {
			this.centroid.add(this.vertices[i]);
		}
		this.centroid.divideScalar(vertLen);

		// add center of mass to physics
		if (Component.components.Physics.hasOwnProperty(id)) {
			this.Physics = Component.components.Physics[id];
			this.Physics.centerOfMass = this.centroid;
		}

		this.Object3D = obj;
	}

	getAABB() {
		const cached = this.cached.AABB;
		const obj = this.Object3D;
		if (!cached.updated) {
			// TODO! can optimize to transform diff rather than setFromObject each time

			if (!cached.position.equals(obj.position) || !cached.rotation.equals(obj.rotation) || !cached.scale.equals(obj.scale)) {
				this.AABB.setFromObject(obj);
				cached.position = obj.position.clone();
				cached.rotation = obj.rotation.clone();
				cached.scale = obj.scale.clone();
			}
			cached.updated = true;
		}

		return this.AABB;
	}

	getVertices() {
		const cached = this.cached.vertices;
		const obj = this.Object3D;
		if (!cached.updated) {
			// TODO! can optimize to transform diff rather than clone origin each time

			if (!cached.position.equals(obj.position) || !cached.rotation.equals(obj.rotation) || !cached.scale.equals(obj.scale)) {
				for (let i = 0, len = this.vertices.length; i < len; i++) {
					this.vertices[i] = cached.origin[i].clone().applyEuler(obj.rotation).add(obj.position).multiply(obj.scale);
				}
				cached.position = obj.position.clone();
				cached.rotation = obj.rotation.clone();
				cached.scale = obj.scale.clone();
			}

			cached.updated = true;
		}

		return this.vertices;
	}

	resetUpdate() {
		this.cached.AABB.updated = false;
		this.cached.vertices.updated = false;
	}
}

class Physics {
	constructor(data) {
		this.velocity = data.hasOwnProperty('velocity') ? data.velocity : new THREE.Vector3();
		this.angularVelocity = data.hasOwnProperty('angularVelocity') ? data.angularVelocity : new THREE.Vector3();
		this.mass = data.hasOwnProperty('mass') ? data.mass : 1;
		this.useGravity = data.hasOwnProperty('useGravity') ? data.useGravity : true;
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
	data.position = data.hasOwnProperty('position') ? data.position : new THREE.Vector3();
	data.rotation = data.hasOwnProperty('rotation') ? data.rotation : new THREE.Euler();
	data.scale = data.hasOwnProperty('scale') ? data.scale : new THREE.Vector3(1, 1, 1);

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