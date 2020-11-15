import { Animation } from "../components/Animation.js";
import { Mesh } from "../components/Mesh.js";
import { OrthographicCamera } from "../components/camera/OrthographicCamera.js";
import { PerspectiveCamera } from "../components/camera/PerspectiveCamera.js";
import { Rigidbody } from "../components/physics/Rigidbody.js";
import { BoxCollider } from "../components/physics/BoxCollider.js";
import { CapsuleCollider } from "../components/physics/CapsuleCollider.js";
import { ConeCollider } from "../components/physics/ConeCollider.js";
import { CylinderCollider } from "../components/physics/CylinderCollider.js";
import { SphereCollider } from "../components/physics/SphereCollider.js";

const cProto = {
	destroy: {
		value: function () {
			if (this.enabled) {
				const type = this.cType;
				const container = this.entity.scene._containers[type];
				container.splice(container.indexOf(this), 1);
			} else {
				if ("onDisable" in this) this.onDisable();
			}

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
				if (value) {
					const container = this.entity.scene._containers[this.cType];
					container.push(c);
					if ("onEnable" in this) this.onEnable();
				} else {
					const container = this.entity.scene._containers[this.cType];
					container.splice(container.indexOf(this), 1);
					if ("onDisable" in this) this.onDisable();
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

	cProto.cType.value = type;
	Object.defineProperties(obj.prototype, cProto);

	_components[type] = obj;
}

createComponent("Animation", Animation);
createComponent("Mesh", Mesh);
createComponent("OrthographicCamera", OrthographicCamera);
createComponent("PerspectiveCamera", PerspectiveCamera);
createComponent("Rigidbody", Rigidbody);
createComponent("BoxCollider", BoxCollider);
createComponent("CapsuleCollider", CapsuleCollider);
createComponent("ConeCollider", ConeCollider);
createComponent("CylinderCollider", CylinderCollider);
createComponent("SphereCollider", SphereCollider);

export { _components, getComponent, createComponent };
