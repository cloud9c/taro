import { Animation } from "../components/Animation.js";
import { Camera } from "../components/Camera.js";
import { Object3D } from "../components/Object3D.js";
import { Rigidbody } from "../components/physics/Rigidbody.js";
import { Transform } from "../components/Transform.js";

import { BoxCollider } from "../components/physics/BoxCollider.js";
import { CapsuleCollider } from "../components/physics/CapsuleCollider.js";
import { ConeCollider } from "../components/physics/ConeCollider.js";
import { CylinderCollider } from "../components/physics/CylinderCollider.js";
import { SphereCollider } from "../components/physics/SphereCollider.js";

const handler = {
	defineProperty(target, property, descriptor) {
		if (Component._events.hasOwnProperty(property)) {
			Component._events.property.push(target.prototype.type);
		}
		return true;
	},
	deleteProperty(target, property) {
		if (Component._events.hasOwnProperty(property)) {
			Component._events.property.splice(
				Component._events.property.indexOf(target.prototype.type),
				1
			);
		}
		return true;
	},
};

const Component = {
	// init, onEnable, onDisable isnt in _events
	_events: {
		update: [],
		fixedUpdate: [],

		onCollisionEnter: [],
		onCollisionStay: [],
		onCollisionExit: [],
	},
	_components: {},
	_containers: {},
	getContainer(type) {
		return this._containers[type];
	},
	getComponent(type) {
		return this._components[type];
	},
	createComponent(type, object) {
		if (this._components.hasOwnProperty(type))
			throw "Component type already exists";

		for (const property in this._events) {
			if (property in object.prototype) {
				this._events[property].push(type);
			}
		}

		object.prototype._enabled = true;
		Object.defineProperties(object.prototype, {
			destroy: {
				value: destroy,
			},
			type: {
				value: type,
			},
			enabled: {
				get() {
					return this._enabled;
				},
				set(value) {
					if (value != this._enabled) {
						this._enabled = value;
						if (value && "onEnable" in object.prototype) {
							object.prototype.onEnable();
						} else if ("onDisable" in object.prototype) {
							object.prototype.onDisable();
						}
					}
				},
			},
		});

		object = new Proxy(object, handler);

		this._components[type] = object;
		this._containers[type] = [];
	},
};

function destroy() {
	const type = this.type;
	Component._containers[type].splice(
		Component._containers[type].indexOf(this),
		1
	);

	const _c = this.entity._components;
	if (_c[type].length > 1) _c[type].splice(_c[type].indexOf(this), 1);
	else delete _c[type];

	if (Component._events.onDestroy.includes(type)) _c[type].onDestroy();
}

const coreComponents = {
	Animation: Animation,
	Camera: Camera,
	Object3D: Object3D,
	Rigidbody: Rigidbody,
	Transform: Transform,

	BoxCollider: BoxCollider,
	CapsuleCollider: CapsuleCollider,
	ConeCollider: ConeCollider,
	CylinderCollider: CylinderCollider,
	SphereCollider: SphereCollider,
};

for (const core in coreComponents) {
	Component.createComponent(core, coreComponents[core]);
}

export { Component };
