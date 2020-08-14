import { Component } from "./Component.js";

class Entity {
	constructor(id) {
		Entity.entities.push(this);
		this._components = {};
		this.id = id;
		this.tags = [];

		console.log(this);

		this.addComponent("Transform");
		this.transform = this._components["Transform"];
	}

	addTag(name) {
		if (this.tags.indexOf(name) === -1) {
			this.tags.push(name);

			if (Entity._tags.hasOwnProperty(name))
				Entity._tags[name].push(this);
			else Entity._tags[name] = [this];
		}
	}

	removeTag(name) {
		const index = this.tags.indexOf(name);
		if (index !== -1) {
			this.tags.splice(index, 1);
			if (Entity._tags[name].length > 1) {
				Entity._tags[name].splice(Entity._tags[name].indexOf(this), 1);
			} else {
				delete Entity._tags[name];
			}
		}
	}

	get id() {
		return this._id;
	}

	set id(id) {
		this._id = id;
		Entity._ids[id] = this;
	}

	static find(id) {
		return Entity._ids[id];
	}

	static findByTag(tag) {
		return Entity._tags[tag];
	}

	getComponent(type) {
		const _c = this._components[type];
		return Array.isArray(_c) ? _c[type][0] : _c;
	}

	getComponents(type) {
		return this._components[type];
	}

	addComponent(type, data = {}) {
		const newComponent = new Component._components[type]();
		newComponent.entity = this;

		if (!Component._containers.hasOwnProperty(type))
			Component._containers[type] = [newComponent];
		else Component._containers[type].push(newComponent);

		if ("init" in newComponent) newComponent.init(data);

		if (this._components.hasOwnProperty(type)) {
			const _c = this._components[type];
			if (Array.isArray(_c)) _c.push(newComponent);
			else _c[type] = [_c, newComponent];
		} else this._components[type] = newComponent;

		return this;
	}

	destroy() {
		Entity.entities.splice(Entity.entities.indexOf(this), 1);
	}
}

Entity._entities = [];
Entity._ids = {};
Entity._tags = {};

export { Entity };
