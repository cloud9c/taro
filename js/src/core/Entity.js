import { Group } from "../lib/three.module.js";
import { Scene } from "./Scene.js";
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
			Scene.getScene().add(this);
		}

		this._events = {};
	}

	getComponent(type) {
		const container = this.scene._containers[type];
		for (let i = 0, len = container.length; i < len; i++) {
			if (container[i].entity === this) {
				return this;
			}
		}
	}

	getComponents(type) {
		const list = [];
		const container = this.scene._containers[type];
		for (let i = 0, len = container.length; i < len; i++) {
			if (container[i].entity === this) {
				list.push(this);
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
		if ("init" in c) c.init(data);
		if ("onEnable" in c) c.onEnable();

		return c;
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
