import { Group } from "../lib/three.js";
import { Scene } from "./Scene.js";
import { Application } from "./Application.js";
import { _components } from "../engine.js";

export class Entity extends Group {
	constructor(name, scene) {
		super();

		this.tags = [];
		this._disabled = [];

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
		for (let i = 0, len = this._disabled.length; i < len; i++) {
			if (this._disabled[i].componentType === type)
				return this._disabled[i];
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
		for (let i = 0, len = this._disabled.length; i < len; i++) {
			if (this._disabled[i].componentType === type)
				list.push(this._disabled[i]);
		}
		return list;
	}

	addComponent(type, data = {}) {
		const component = new _components[type]();

		Object.defineProperty(component, "entity", {
			value: this,
		});

		if (!(type in this.scene._containers))
			this.scene._containers[type] = [];

		this.scene._containers[type].push(component);
		if ("start" in component) component.start(data);
		component.dispatchEvent({ type: "enable" });

		return component;
	}

	add(obj) {
		if (obj instanceof Entity && obj.scene !== this.scene) {
			this.scene.add(obj);
		}
		super.add(obj);
	}

	remove(obj) {
		if (obj instanceof Entity) {
			this.scene.add(obj);
		} else {
			super.remove(obj);
		}
	}

	getChildren() {
		const filteredChildren = [];
		const children = this.children;
		for (let i = 0, len = children.length; i < len; i++) {
			if (children[i] instanceof Entity)
				filteredChildren.push(children[i]);
		}
		return filteredChildren;
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
