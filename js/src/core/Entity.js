import { Component } from "./Component.js";

class Entity {
	constructor(id) {
		Entity._entities.push(this);
		this._components = {};
		this._tags = [];
		this._events = {};
		this.addComponent("Transform");

		this.id = id;

		Object.defineProperty(this, "transform", {
			value: this._components["Transform"][0],
		});
		console.log(this);
	}

	get tags() {
		return this._tags.slice(0);
	}

	addTag(name) {
		if (!this._tags.includes(name) && typeof name === "string") {
			this._tags.push(name);

			const tagArray = Entity._tags[name];
			if (tagArray) tagArray.push(this);
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
		if (typeof id === "string") {
			this._id = id;
			Entity._ids[id] = this;
		}
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
		const c = new Component._components[type]();

		Object.defineProperty(c, "entity", {
			value: this,
		});

		Component._containers[type].push(c);

		if ("init" in c) c.init(data);

		if ("onEnable" in c) c.onEnable(data);

		const componentType = this._components[type];
		if (componentType) componentType.push(c);
		else this._components[type] = [c];

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

	// event functions

	on(name, callback, scope) {
		const events = this._events[name];
		callback = scope
			? (...args) => callback.call(scope, ...args)
			: callback;

		if (events) events.push(callback);
		else this._events[name] = [callback];
	}

	once(name, callback, scope) {
		this.on(
			name,
			function g(...args) {
				this.off(name, g);
				callback(...args);
			},
			scope
		);
	}

	off(name, callback) {
		if (name) {
			if (callback) {
				this._events.name = this._events.name.filter(
					(e) => e !== callback
				);
			} else {
				delete this._events.name;
			}
		} else {
			this._events = {};
		}
	}

	fire(name, ...args) {
		const callbacks = this._events[name];
		if (callbacks) {
			for (let i = 0, len = callbacks.length; i < len; i++) {
				callbacks[i](...args);
			}
		}
	}

	// static functions

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
