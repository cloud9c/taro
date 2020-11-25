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

	add(entity) {
		if (!("scene" in entity)) {
		} else if (entity.scene !== this) {
			const containers = entity.scene._containers;
			for (const type in containers) {
				const container = containers[type];
				for (let i = 0, len = container.length; i < len; i++) {
					if (container[i].entity === entity) {
						container.splice(i, 1);
						if (!(type in this._containers))
							this._containers[type] = [];
						this._containers[type].push(container[i]);
					}
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
