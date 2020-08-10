import Component from "./Component.js";
import { Transform } from "./engine.js";

class Entity {
	constructor() {
		this.id =
			(+new Date()).toString(16) +
			(Math.random() * 100000000 || 0).toString(16);

		Entity.entities[this.id] = this;
		this.addComponent(Transform);
	}

	addComponent(type, data = {}) {
		const name = type.name;
		if (!Component.components.hasOwnProperty(name))
			Component.components[name] = [];

		const newComponent = new type(this);
		Component.components[name].push(newComponent);

		if (this.hasOwnProperty(name)) {
			if (Array.isArray(this[name])) this[name].push(newComponent);
			else this[name] = [this[name], newComponent];
		} else this[name] = newComponent;

		if (typeof newComponent.init === "function") newComponent.init(data);
		return this;
	}

	removeComponent(c) {
		const name = c.name;
		let index = Component.components[name].indexOf(c);

		if (index === -1) throw "Component doesn't exist";
		Component.components[name].splice(index, 1);

		index = this[name].indexOf(c);

		if (index === -1) throw "Component doesn't exist";

		if (Array.isArray(this[name]) && this[name].length > 1)
			this[name].splice(index, 1);
		else delete this[name];
		return this;
	}
}

Entity.entities = {};

export default Entity;
