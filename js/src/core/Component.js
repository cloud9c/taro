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
import { Joint } from "../components/physics/Joint.js";

import { EventDispatcher } from "../lib/three.js";

const cProto = {
	destroy: {
		value: function () {
			if (this.enabled) {
				const type = this.componentType;
				const container = this.entity.scene._containers[type];
				container.splice(container.indexOf(this), 1);
			} else {
				this.dispatchEvent({ type: "disable" });
			}
			const components = this.entity._components;
			components.splice(components.indexOf(this), 1);

			this.dispatchEvent({ type: "destroy" });
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
				if (value && !this.entity._enabled) return;
				this._enabled = value;

				const container = this.entity.scene._containers[
					this.componentType
				];
				if (value) {
					container.push(this);
					this.dispatchEvent({ type: "enable" });
				} else {
					container.splice(container.indexOf(this), 1);
					this.dispatchEvent({ type: "disable" });
				}
			}
		},
	},
};

const _components = {};

function createComponent(type, obj, options = {}) {
	if (type in _components) throw "Component type already exists";

	cProto.componentType.value = type;
	Object.defineProperties(obj.prototype, cProto);
	Object.assign(obj.prototype, EventDispatcher.prototype);

	_components[type] = [obj, options];
	return obj;
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
createComponent("Joint", Joint);

export { _components, createComponent };
