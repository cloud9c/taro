import { Animation } from "./components/Animation.js";
import { Camera } from "./components/Camera.js";
import { Object3D } from "./components/Object3D.js";
import { Rigidbody } from "./components/physics/Rigidbody.js";
import { Transform } from "./components/Transform.js";

import { BoxCollider } from "./components/physics/Collider.js";

Animation.prototype.destroy = destroy;
Camera.prototype.destroy = destroy;
Collider.prototype.destroy = destroy;
Object3D.prototype.destroy = destroy;
Rigidbody.prototype.destroy = destroy;
Transform.prototype.destroy = destroy;

Animation.prototype.type = "Animation";
Camera.prototype.type = "Camera";
Collider.prototype.type = "Collider";
Object3D.prototype.type = "Object3D";
Rigidbody.prototype.type = "Rigidbody";
Transform.prototype.type = "Transform";

const Component = {
	_components: {
		Animation: Animation,
		Camera: Camera,
		Collider: Collider,
		Object3D: Object3D,
		Rigidbody: Rigidbody,
		Transform: Transform,
	},
	_containers: {
		Animation: [],
		Behavior: [],
		Camera: [],
		Collider: [],
		Object3D: [],
		Rigidbody: [],
		Transform: [],
	},
	getContainer(type) {
		return this._containers[type];
	},
	getComponent(type) {
		return this._components[type];
	},
	createComponent(type, object) {
		if (this._components.hasOwnProperty(type))
			throw "Component type already exists";
		object.prototype.destroy = destroy();
		object.prototype.type = type;
		this._components[type] = object;
	},
};

function destroy() {
	const type = this.type;

	console.log(this);

	Component._containers[type].splice(
		Component._containers[type].indexOf(this),
		1
	);

	const _c = this.entity._components;
	if (Array.isArray(_c[type]) && _c[type].length > 1)
		_c[type].splice(_c[type].indexOf(this), 1);
	else delete _c[type];
}

export { Component };
