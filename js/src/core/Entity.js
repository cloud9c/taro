import { Group } from "../lib/three.module.js";

export class Entity extends Group {
	constructor(id) {
		super();

		this._components = {};
		this._events = {};

		console.log(this);
	}

	get components() {
		const clone = Object.assign({}, this._components);
		for (const type in clone) {
			clone[type] = clone[type].slice(0);
		}
		return clone;
	}

	getComponent(type) {
		return this._components[type] ? this._components[type][0] : null;
	}

	getComponents(type) {
		return this._components[type] ? this._components[type].slice(0) : null;
	}

	addComponent(type, data = {}) {
		const c = new ENGINE._components[type](data);

		Object.defineProperty(c, "entity", {
			value: this,
		});

		if ("scene" in this) {
			this.scene._containers[type].push(c);
		}

		if ("init" in c) c.init(data);

		const componentType = this._components[type];
		if (componentType) componentType.push(c);
		else this._components[type] = [c];

		return this;
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
}
