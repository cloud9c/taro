import * as THREE from 'https://threejs.org/build/three.module.js';
import System from './system.js'
import {
    ConvexHull
} from 'https://threejs.org/examples/jsm/math/ConvexHull.js';
import {
    SimplifyModifier
} from 'https://threejs.org/examples/jsm/modifiers/SimplifyModifier.js';

const Component = {
    Animation: setDataComponent,
    Behavior: setDataComponent,
    Collider: (id, type, data) => {
        setDataComponent(id, type, new Collider(id, data));
    },
    Interactable: setDataComponent,
    Object3D: (id, type, data) => {
        const transform = Component.components.Transform[id];
        if (transform) {
            transform.position = data.position;
            transform.rotation = data.rotation;
            transform.scale = data.scale;
        }
        setDataComponent(id, type, data);
        System.render.scene.add(data);
    },
    Physics: (id, type, data) => {
        if (data.useGravity === undefined)
            data.useGravity = true
        setDataComponent(id, type, new Physics(data));
    },
    Transform: (id, type, data) => {
        const object = Component.components.Object3D[id];
        if (object) {
            data.position = object.position.copy(data.position);
            data.rotation = object.rotation.copy(data.rotation);
            data.scale = object.scale.copy(data.scale);
        }
        setDataComponent(id, type, data);
    }
}

const simplify = new SimplifyModifier();

class Collider {
    constructor(id, data) {
        const obj = Component.components.Object3D[id];
        if (obj === undefined)
            throw 'Object3D dependency';

        this.material = data.material;
        this.onCollisionEnter = data.onCollisionEnter;
        this.onCollisionExit = data.onCollisionExit;

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
        obj.position.set(0, 0, 0);
        obj.rotation.set(0, 0, 0);
        obj.scale.set(1, 1, 1);

        const reducedObj = obj.clone();
        const MAX_VERTICES = 100;
        let TOTAL_VERTICES;

        reducedObj.traverse((o) => {
            if (o.isMesh)
                TOTAL_VERTICES += o.geometry.attributes.position.count;
        });

        const REDUCTION_FACTOR = MAX_VERTICES/TOTAL_VERTICES;

        if (REDUCTION_FACTOR < 1)
            reducedObj.traverse((o) => {
                if (o.isMesh) {
                    const count = o.geometry.attributes.position.count;
                    const amount = Math.floor(count * REDUCTION_FACTOR);
                    if (amount < count)
                        o.geometry = modifer.modify(o.geometry, amount);
                }
            });

        const origin = new ConvexHull().setFromObject(reducedObj).vertices;

        obj.position.copy(this.cached.AABB.position);
        obj.rotation.copy(this.cached.AABB.rotation);
        obj.scale.copy(this.cached.AABB.scale);

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
        this.Physics = Component.components.Physics[id];
        if (this.Physics !== undefined) {
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
    };

    resetUpdate() {
        this.cached.AABB.updated = false;
        this.cached.vertices.updated = false;
    };
}

class Physics {
    constructor(data) {
        this.velocity = data.velocity;
        this.angularVelocity = data.angularVelocity;
        this.mass = data.mass;
    }

    isMoving() {
        return this.velocity.x != 0 && this.velocity.z != 0;
    }

    isGrounded() {
        return this.velocity.y == 0;
    }
}

function setDataComponent(id, type, data) {
    Component.components[type][id] = data;
}

Object.defineProperty(Component, 'components', {
    value: new Object(),
    enumerable: false
});

for (const type in Component) {
    Component.components[type] = new Object();
}

export default Component;