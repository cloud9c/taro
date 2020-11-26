import { Scene as TS } from "../lib/three.js";
import { OIMO } from "../lib/oimoPhysics.js";
import { Entity } from "./entity.js";
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

	// used internally
	add(entity) {
		if ("scene" in entity && entity.scene !== this) {
			const components = entity._components;
			for (let i = 0, len = components.length; i < len; i++) {
				const component = components[i];
				if (component._enabled) {
					const type = component.componentType;
					const container = entity.scene._containers[type];
					container.splice(container.indexOf(component), 1);
					if (!(type in this._containers))
						this._containers[type] = [];
					this._containers[type].push(component);
				}
			}
		}
		entity.scene = this;
		super.add(entity);
		return entity;
	}

	find(name) {
		return this.getObjectByName(name);
	}

	findByTag(tag) {
		const matches = [];
		this.traverse((child) => {
			if (child instanceof Entity && child.tags.includes(tag)) {
				matches.push(child);
			}
		});
		return matches;
	}

	findById(id) {
		return this.getObjectById(id);
	}
}

Scene._currentScene;
