import Component from "./Component.js";

class Entity {
	constructor(data = {}) {
		this.components = {};
		this.id =
			(+new Date()).toString(16) +
			(Math.random() * 100000000 || 0).toString(16);

		Entity.entities[this.id] = this;
		this.addComponent("Transform", data);
	}

	addComponent(type, data = {}) {
		Component[type](this.id, type, data);
		this.components[type] = Component.components[type][this.id];
		return this;
	}

	removeComponent(type) {
		delete Component.components[type][this.id];
		delete this.components[type];
	}
}

Entity.entities = {};

export default Entity;
