import * as THREE from "./lib/three.module.js";
import {
	Color,
	Euler,
	Matrix3,
	Matrix4,
	Plane,
	Quaternion,
	Ray,
	Vector2,
	Vector3,
	Vector4,
} from "./lib/three.module.js";
import { Entity } from "./core/Entity.js";
import { Scene } from "./core/Scene.js";
import { Application } from "./core/Application.js";

const cProto = {
	destroy: {
		value: function () {
			const type = this.cType;
			if ("scene" in this.entity && this._enabled) {
				const container = this.entity.scene._containers[type];
				container.splice(container.indexOf(this), 1);

				if ("onDisable" in this) this.onDisable();
			}

			const c = this.entity._components;
			if (c[type].length > 1) c[type].splice(c[type].indexOf(this), 1);
			else delete c[type];

			if ("onDestroy" in this) this.onDestroy();
		},
	},
	cType: {
		value: null,
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
				if (value) {
					if ("scene" in this.entity) {
						const container = this.entity.scene._containers[
							this.cType
						];
						container.splice(container.indexOf(this), 1);
					}
					if ("onEnable" in this) this.onEnable();
				} else {
					if ("scene" in this.entity) {
						const container = this.entity.scene._containers[
							this.cType
						];
						container.splice(container.indexOf(this), 1);
					}
					if ("onDisable" in this) this.onDisable();
				}
			}
		},
	},
};

window.THREE = THREE;
window.ENGINE = {
	_components: {},
	getComponent(type) {
		return this._components[type];
	},
	createComponent(type, obj) {
		if (type in this._components) throw "Component type already exists";

		cProto.cType.value = type;
		Object.defineProperties(obj.prototype, cProto);

		this._components[type] = obj;
	},
	Color,
	Euler,
	Matrix3,
	Matrix4,
	Plane,
	Quaternion,
	Ray,
	Vector2,
	Vector3,
	Vector4,
	Application,
	Entity,
	Scene,
};

const scripts = [
	"./components/Animation.js",
	"./components/Mesh.js",
	"./components/camera/OrthographicCamera.js",
	"./components/camera/PerspectiveCamera.js",
	"./components/physics/Rigidbody.js",
	"./components/physics/BoxCollider.js",
	"./components/physics/CapsuleCollider.js",
	"./components/physics/ConeCollider.js",
	"./components/physics/CylinderCollider.js",
	"./components/physics/SphereCollider.js",
];

for (let i = 0, len = scripts.length; i < len; i++) {
	import(scripts[i]);
}
