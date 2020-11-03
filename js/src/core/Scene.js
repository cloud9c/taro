import { Scene as TScene } from "../lib/three.module.js";
import { OIMO } from "../lib/oimoPhysics.js";

export class Scene {
	constructor() {
		this._scene = new TScene();
		this.cameras = [];
		this._containers = {};
		for (const type in ENGINE._components) {
			this._containers[type] = [];
		}
		this._physicsWorld = new OIMO.World(2);
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
				if ("onEnable" in type[i]) type[i].onEnable();
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
				if ("onDisable" in type[i]) type[i].onDisable();
			}
		}
		delete entity.scene;
		this._scene.remove(entity);
		return entity;
	}
}
