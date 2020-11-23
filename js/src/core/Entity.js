import { Group } from "../lib/three.js";
import { Scene } from "./Scene.js";
import { Application } from "./Application.js";
import { _components } from "../engine.js";

export class Entity extends Group {
	constructor(name, scene) {
		super();

		if (name !== undefined) {
			if (name instanceof Scene) {
				name.add(this);
			} else {
				this.name = name;
			}
		}

		if (scene instanceof Scene) {
			scene.add(this);
		} else {
			Application._currentApp.scene.add(this);
		}
	}

	getComponent(type) {
		const container = this.scene._containers[type];
		for (let i = 0, len = container.length; i < len; i++) {
			if (container[i].entity === this) {
				return container[i];
			}
		}
	}

	getComponents(type) {
		const list = [];
		const container = this.scene._containers[type];
		for (let i = 0, len = container.length; i < len; i++) {
			if (container[i].entity === this) {
				list.push(container[i]);
			}
		}
		return list;
	}

	addComponent(type, data = {}) {
		const c = new _components[type]();

		Object.defineProperty(c, "entity", {
			value: this,
		});

		this.scene._containers[type].push(c);
		if ("start" in c) c.start(data);
		c.dispatchEvent({ type: "enable" });

		return c;
	}

	find(v) {
		if (typeof v === "string") return this.getObjectByName(v);
		else return this.getObjectById(v);
	}
}
