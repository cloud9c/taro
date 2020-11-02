import { Scene as TScene } from "../lib/three.module.js";

export class Scene {
	constructor() {
		this._scene = new TScene();
		this.cameras = [];
		this._containers = {};
		for (let i = 0, len = ENGINE._components.length; i < len; i++) {
			this._containers[ENGINE._components[i]] = [];
		}
	}
	add(entity) {
		for (const c in entity._components) {
			const type = entity._components[c];
			for (let i = 0, len = type.length; i < len; i++) {
				this._containers[c].push(type[i]);
				if ("onEnable" in type[i]) type[i].onEnable();
			}
		}
		entity.scene = this;
		this._scene.add(entity);
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
		entity.scene = this;
		this._scene.remove(entity);
		return entity;
	}
}
