import { Group } from "../lib/three.js";
import { Scene } from "./Scene.js";
import { Application } from "./Application.js";
import { _components } from "./Component.js";

export class Entity extends Group {
	constructor(name, scene) {
		super();

		this.tags = [];

		this.isEntity = true;
		this._components = [];
		this._enabled = true;

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
		const components = this._components;
		for (let i = 0, len = components.length; i < len; i++) {
			if (components[i].componentType === type) return components[i];
		}
	}

	getComponents(type) {
		const list = [];
		const components = this._components;
		for (let i = 0, len = components.length; i < len; i++) {
			if (components[i].componentType === type) list.push(components[i]);
		}
		return list;
	}

	addComponent(type, data = {}) {
		const options = _components[type][1];
		if (
			options.allowMultiple === false &&
			this.getComponent(type) !== undefined
		) {
			return console.warn("allowMultiple Attribute is false");
		}

		if ("requireComponents" in options) {
			required = options.requireComponents;
			for (let i = 0, len = required.length; i < len; i++)
				if (this.getComponent(required[i]) === undefined)
					this.addComponent(required[i]);
		}

		const component = new _components[type][0]();

		Object.defineProperty(component, "entity", {
			value: this,
		});

		if (!(type in this.scene._containers))
			this.scene._containers[type] = [];

		this.scene._containers[type].push(component);
		if ("start" in component) component.start(data);
		component.dispatchEvent({ type: "enable" });

		this._components.push(component);

		return component;
	}

	add(obj) {
		if (obj instanceof Entity && obj.scene !== this.scene) {
			this.scene.add(obj);
		}
		return super.add(obj);
	}

	remove(obj) {
		if (obj instanceof Entity) {
			this.scene.add(obj);
		} else {
			super.remove(obj);
		}
		return obj;
	}

	destroy() {
		this.enabled = false;
		const children = this.getChildren();
		for (let i = 0, len = children.length; i < len; i++)
			children[i].destroy();
		this.scene.remove(this);
	}

	get enabled() {
		return this._enabled;
	}

	set enabled(value) {
		if (value != this._enabled) {
			if (value && !this.parent._enabled)
				return console.warn(
					"Entity: Can't enable if an ancestor is disabled"
				);
			this._enabled = value;

			const components = this._components;
			for (let i = 0, len = components.length; i < len; i++)
				components[i].enabled = value;

			const children = this.getChildren();
			for (let i = 0, len = children.length; i < len; i++)
				children[i].enabled = value;

			this.dispatchEvent({ type: value ? "enable" : "disable" });
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

	get app() {
		return this.scene.app;
	}

	toJSON(meta) {
		const output = super.toJSON(meta);
		console.log(output);
	}
}
