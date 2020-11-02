import { OIMO } from "../../lib/oimoPhysics.js";
import { Physics } from "../../Physics.js";
import { Euler } from "../../math/Euler.js";
import { Vector3 } from "../../math/Vector3.js";

class UniversalJoint {
	init(data) {
		if ("_physicsRef" in this.entity) {
			this._ref = this.entity._physicsRef;
		} else {
			Rigidbody.config.position.copyFrom(this._position);
			Rigidbody.config.rotation.fromEulerXyz(this._rotation);

			this.entity._physicsRef = this._ref = new OIMO.RigidBody(
				Rigidbody.config
			);
		}
	}

	onEnable() {}

	onDisable() {}

	// https://saharan.github.io/OimoPhysics/oimo/dynamics/constraint/joint/UniversalJoint.html
}
