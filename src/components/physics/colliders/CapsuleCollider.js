import { Collider } from "./Collider.js";
import { OIMO } from "../../../lib/oimo.js";

export class CapsuleCollider extends Collider {

	start( data ) {

		data.type = "capsule";
		super.start( data );

	}

	_addDerivedProperties( data ) {

		this._radius = "radius" in data ? data.radius : 0.5;
		this._halfHeight = "halfHeight" in data ? data.halfHeight : 1;

	}

	_setGeometry( scale, max ) {

		return new OIMO.CapsuleGeometry(
			this._radius * max,
			this._halfHeight * max
		);

	}

	toJSON() {

		const object = super.toJSON();

		object.radius = this._radius;
		object.halfHeight = this._halfHeight;

		return object;

	}

}
