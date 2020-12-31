import { Collider } from "./Collider.js";
import { OIMO } from "../../../lib/oimo.js";

export class SphereCollider extends Collider {

	start( data ) {

		this.type = "sphere";
		super.start( data );

	}

	_addDerivedProperties( data ) {

		this._radius = "radius" in data ? data.radius : 0.5;

	}

	_setGeometry( scale, max ) {

		return new OIMO.SphereGeometry( this._radius * max );

	}

	toJSON() {

		const object = super.toJSON();

		object.radius = this._radius;

		return object;

	}

}
