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

const Component = {
	_updates: [],
	_fixedUpdates: [],
	_lateUpdates: [],
	_components: {},
	_containers: {},
	getContainer(type) {
		return this._containers[type];
	},
	getComponent(type) {
		return this._components[type];
	},
	createComponent(type, object) {
		if (type in this._components) throw "Component type already exists";

		Object.defineProperties(object.prototype, {
			destroy: {
				value: destroy,
			},
			type: {
				value: type,
			},
			_enabled: {
				value: true,
			},
			enabled: {
				get() {
					return this._enabled;
				},
				set(value) {
					if (value != this._enabled) {
						this._enabled = value;
						if (value && "onEnable" in this) {
							object.prototype.onEnable();
						} else if ("onDisable" in this) {
							object.prototype.onDisable();
						}
					}
				},
			},
		});

		this._components[type] = object;
		this._containers[type] = [];

		if ("update" in object.prototype) {
			Component._updates.push(Component._containers[type]);
		}
		if ("fixedUpdate" in object.prototype) {
			Component._fixedUpdates.push(Component._containers[type]);
		}
		if ("lateUpdate" in object.prototype) {
			Component._lateUpdates.push(Component._containers[type]);
		}
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

console.log(Animation);

export { Component };
