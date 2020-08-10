import { Euler, Vector3 } from "../engine.js";
import Component from "../Component.js";

class Transform extends Component {
	init(data) {
		this._position = data.hasOwnProperty("position")
			? data.position
			: new Vector3();
		this._rotation = data.hasOwnProperty("rotation")
			? data.rotation
			: new Euler();
		this._scale = data.hasOwnProperty("scale")
			? data.scale
			: new Vector3(1, 1, 1);
	}
	getPosition() {
		return this._position.clone();
	}
	setPosition(x, y, z) {
		this._position.set(x, y, z);
		if (this.entity.hasOwnProperty("Rigidbody"))
			this.entity.Rigidbody._ref.setPosition(this._position);
	}
	getRotation() {
		return this._rotation.clone();
	}
	setRotation(x, y, z) {
		this._rotation.set(x, y, z);
		if (this.entity.hasOwnProperty("Rigidbody"))
			this.entity.Rigidbody._ref.setRotationXyz(this._rotation);
	}
	getScale() {
		return this._scale.clone();
	}
	setScale(x, y, z) {
		this._scale.set(x, y, z);
		if (this.entity.hasOwnProperty("Collider"))
			this.entity.Collider.recomputeShapes();
	}
}

export default Transform;
