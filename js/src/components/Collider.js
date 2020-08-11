import { OIMO } from "../lib/oimoPhysics.js";
import { System } from "../System.js";

class Collider {
	init(data) {
		this.shapes = [];

		if (this.entity.hasOwnProperty("Rigidbody")) {
			this._ref = this.entity.Rigidbody._ref;
		} else {
			Collider._config.position = Collider._config.position.copyFrom(
				this.entity.Transform._position
			);
			Collider._config.rotation = Collider._config.rotation.fromEulerXyz(
				this.entity.Transform._rotation
			);
			this._ref = new OIMO.RigidBody(Collider._config);
			System.world.addRigidBody(this._ref);
		}
		this.add(data);
	}

	recomputeShapes() {
		for (let i = 0, len = this.shapes.length; i < len; i++) {
			this.shapes[i].recompute();
		}
	}

	add(shape) {
		this.shapes.push(shape);
		this._ref.addShape(shape._ref);
		shape.collider = this;
		return shape;
	}

	remove(shape) {
		const index = this.shapes.indexOf(shape);
		if (index !== -1) {
			this.shapes.splice(index, 1);
			this._ref.removeShape(shape._ref);
			shape.collider = null;
		} else {
			throw "Shape doesn't exist in this collider";
		}
	}
}

Collider._config = new OIMO.RigidBodyConfig();
Collider._config.type = 1;

export { Collider };
