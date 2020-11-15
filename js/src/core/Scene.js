import { Scene as TS } from "../lib/three.module.js";
import { OIMO } from "../lib/oimoPhysics.js";
import { PerspectiveCamera } from "../components/camera/PerspectiveCamera.js";

export class Scene {
	constructor() {
		this._scene = new TS();
		this.cameras = [];

		this._containers = {};
		for (const type in ENGINE._components) {
			this._containers[type] = [];
		}
		this._physicsWorld = new OIMO.World(2);

		Scene._currentScene = this;
	}
	add(entity) {
		if ("scene" in entity) {
			this.remove(entity);
		}
		entity.scene = this;
		this._scene.add(entity);
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
		this._scene.remove(entity);
		return entity;
	}
	static getScene() {
		return Scene._currentScene;
	}
}

Scene._currentScene;
