import { Animation } from "../components/Animation.js";
import { Mesh } from "../components/Mesh.js";
import { OrthographicCamera } from "../components/camera/OrthographicCamera.js";
import { PerspectiveCamera } from "../components/camera/PerspectiveCamera.js";
import { Rigidbody } from "../components/physics/Rigidbody.js";
import { Collider } from "../components/physics/Collider.js";
import { EventDispatcher } from "../lib/three.js";

const cProto = Object.assign(
	{
		destroy() {
			if (this.enabled) {
				const type = this.cType;
				const container = this.entity.scene._containers[type];
				container.splice(container.indexOf(this), 1);
			} else {
				if ("onDisable" in this) this.onDisable();
			}

			if ("onDestroy" in this) this.onDestroy();
		},
		cType: null,
		_enabled: true,
		get enabled() {
			return this._enabled;
		},
		set enabled(value) {
			if (value != this._enabled) {
				this._enabled = value;
				if (value) {
					const container = this.entity.scene._containers[this.cType];
					container.push(c);
					this.dispatchEvent({ type: "enable" });
				} else {
					const container = this.entity.scene._containers[this.cType];
					container.splice(container.indexOf(this), 1);
					this.dispatchEvent({ type: "disable" });
				}
			}
		},
	},
	EventDispatcher.prototype
);

const _components = {};

function getComponent(type) {
	return _components[type];
}
function createComponent(type, obj) {
	if (type in _components) throw "Component type already exists";

	cProto.cType = type;
	Object.assign(obj.prototype, cProto);

	_components[type] = obj;
}

createComponent("Animation", Animation);
createComponent("Mesh", Mesh);
createComponent("OrthographicCamera", OrthographicCamera);
createComponent("PerspectiveCamera", PerspectiveCamera);
createComponent("Rigidbody", Rigidbody);
createComponent("Collider", Collider);

export { _components, getComponent, createComponent };
