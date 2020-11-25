import { Animation } from "../components/rendering/Animation.js";
import { Renderable } from "../components/rendering/Renderable.js";
import { OrthographicCamera } from "../components/camera/OrthographicCamera.js";
import { PerspectiveCamera } from "../components/camera/PerspectiveCamera.js";
import { AmbientLight } from "../components/light/AmbientLight.js";
import { DirectionalLight } from "../components/light/DirectionalLight.js";
import { HemisphereLight } from "../components/light/HemisphereLight.js";
import { PointLight } from "../components/light/PointLight.js";
import { SpotLight } from "../components/light/SpotLight.js";
import { Rigidbody } from "../components/physics/Rigidbody.js";
import { Collider } from "../components/physics/Collider.js";
import { EventDispatcher } from "../lib/three.js";

const cProto = {
	destroy: {
		value: function () {
			if (this.enabled) {
				const type = this.componentType;
				const container = this.entity.scene._containers[type];
				container.splice(container.indexOf(this), 1);
			} else {
				if ("onDisable" in this) this.onDisable();
			}

			if ("onDestroy" in this) this.onDestroy();
		},
	},
	componentType: { value: null },
	_enabled: { value: true, writable: true },
	enabled: {
		get() {
			return this._enabled;
		},
		set(value) {
			if (value != this._enabled) {
				this._enabled = value;
				if (value) {
					const container = this.entity.scene._containers[
						this.componentType
					];
					container.push(this);
					this.dispatchEvent({ type: "enable" });
				} else {
					const container = this.entity.scene._containers[
						this.componentType
					];
					container.splice(container.indexOf(this), 1);
					this.entity._disabled.push(this);
					this.dispatchEvent({ type: "disable" });
				}
			}
		},
	},
};

const _components = {};

function getComponent(type) {
	return _components[type];
}
function createComponent(type, obj) {
	if (type in _components) throw "Component type already exists";

	cProto.componentType.value = type;
	Object.defineProperties(obj.prototype, cProto);
	Object.assign(obj.prototype, EventDispatcher.prototype);

	_components[type] = obj;
}

createComponent("Animation", Animation);
createComponent("Renderable", Renderable);
createComponent("OrthographicCamera", OrthographicCamera);
createComponent("PerspectiveCamera", PerspectiveCamera);
createComponent("AmbientLight", AmbientLight);
createComponent("DirectionalLight", DirectionalLight);
createComponent("HemisphereLight", HemisphereLight);
createComponent("PointLight", PointLight);
createComponent("SpotLight", SpotLight);
createComponent("Rigidbody", Rigidbody);
createComponent("Collider", Collider);

export { _components, getComponent, createComponent };
