const cProto = {
	destroy: {
		value: function () {
			const type = this.cType;
			Component._containers[type].splice(
				Component._containers[type].indexOf(this),
				1
			);

			const _c = this.entity._components;
			if (_c[type].length > 1) _c[type].splice(_c[type].indexOf(this), 1);
			else delete _c[type];

			if ("onDestroy" in this) this.onDestroy();
		},
	},
	cType: {
		value: null,
	},
	_enabled: {
		value: true,
	},
	enabled: {
		get() {
			return this._enabled;
		},
		set(value) {
			if (value != this._enabled) {
				this._enabled = value;
				if (value && "onEnable" in this) {
					this.onEnable();
				} else if ("onDisable" in this) {
					this.onDisable();
				}
			}
		},
	},
};

const Component = {
	_components: {},
	_containers: {},
	getContainer(type) {
		return this._containers[type];
	},
	getComponent(type) {
		return this._components[type];
	},
	createComponent(type, obj) {
		if (type in this._components) throw "Component type already exists";

		cProto.cType.value = type;
		console.log(obj, cProto);
		Object.defineProperties(obj.prototype, cProto);

		this._components[type] = obj;
		this._containers[type] = [];
	},
};

export { Component };
