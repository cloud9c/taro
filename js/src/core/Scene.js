import { Scene as TS } from "../lib/three.js";
import { OIMO } from "../lib/oimoPhysics.js";
import { PerspectiveCamera } from "../components/camera/PerspectiveCamera.js";
import { _components } from "../engine.js";

export class Scene extends TS {
	constructor() {
		super();
		this._cameras = [];

		this._containers = {};
		for (const type in _components) {
			this._containers[type] = [];
		}
		this._physicsWorld = new OIMO.World(2);
	}
	add(entity) {
		if ("scene" in entity) {
			this.remove(entity);
		}
		entity.scene = this;
		super.add(entity);
		for (const c in entity._components) {
			const type = entity._components[c];
			for (let i = 0, len = type.length; i < len; i++) {
				this._containers[c].push(type[i]);
			}
		}
		return entity;
	}
	remove(entity) {
		for (const c in entity._components) {
			const type = entity._components[c];
			for (let i = 0, len = type.length; i < len; i++) {
				this._containers[c].splice(
					this._containers[c].indexOf(type[i]),
					1
				);
			}
		}
		delete entity.scene;
		super.remove(entity);
		return entity;
	}
	find(v) {
		if (typeof v === "string") return super.getObjectByName(v);
		else return super.getObjectById(v);
	}
}

Scene._currentScene;
