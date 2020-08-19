import { Component } from "./Component.js";

class Entity {
	constructor(id) {
		Entity._entities.push(this);
		this._components = {};
		this._tags = [];
		this.addComponent("Transform");

		Object.defineProperties(this, {
			id: {
				value: id,
				writable: true,
			},
			transform: {
				value: this._components["Transform"][0],
			},
		});
		console.log(this);
	}

	get tags() {
		return this._tags.slice(0);
	}

	addTag(name) {
		if (!this._tags.includes(name)) {
			this._tags.push(name);

			if (Entity._tags.hasOwnProperty(name))
				Entity._tags[name].push(this);
			else Entity._tags[name] = [this];
		}
	}

	removeTag(name) {
		if (this._tags.includes(name)) {
			this._tags.splice(index, 1);
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

	get components() {
		const clone = Object.assign({}, this._components);
		for (const type in clone) {
			clone[type] = clone[type].slice(0);
		}
		return clone;
	}

	getComponent(type) {
		return this._components[type][0];
	}

	getComponents(type) {
		return this._components[type].slice(0);
	}

	addComponent(type, data = {}) {
		const newComponent = new Component._components[type]();

		Object.defineProperty(newComponent, "entity", {
			value: this,
		});

		Component._containers[type].push(newComponent);

		if ("init" in newComponent) newComponent.init(data);

		if (this._components.hasOwnProperty(type))
			this._components[type].push(newComponent);
		else this._components[type] = [newComponent];

		return this;
	}

	destroy() {
		for (const component in this._components) {
			if (Array.isArray(component)) {
			} else {
				component.destroy();
			}
		}
		Entity._entities.splice(Entity._entities.indexOf(this), 1);
	}

	static find(id) {
		return Entity._ids[id];
	}

	static findByTag(tag) {
		return Entity._tags[tag];
	}

	static get entities() {
		return Entity._entities.slice(0);
	}

	static get tags() {
		const tags = Object.assign({}, Entity._tags);
		for (const tag in tags) {
			tags[tag] = tag.slice(0);
		}
		return tags;
	}

	static get ids() {
		return Object.assign({}, Entity._ids);
	}
}

Entity._entities = [];
Entity._ids = {};
Entity._tags = {};

export { Entity };
