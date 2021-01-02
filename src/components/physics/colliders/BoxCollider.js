import { Collider } from "./Collider.js";
import { Vector3 } from "../../../lib/three.js";
import { OIMO } from "../../../lib/oimo.js";

const vector = new Vector3();

export class BoxCollider extends Collider {

	start( data ) {

		data.type = "box";
		super.start( data );

	}

	_addDerivedProperties( data ) {

		this._halfExtents =
					data.halfExtents !== undefined
						? data.halfExtents
						: new Vector( 1, 1, 1 );

	}

	_setGeometry( scale, max ) {

		return new OIMO.BoxGeometry(
			vector.copy( this._halfExtents ).multiply( scale )
		);

	}

	toJSON() {

		const object = super.toJSON();

		object.halfExtents = this._halfExtents.toArray();

		return object;

	}

	fromJSON( object ) {

		object = super.fromJSON( object );

		object.halfExtents = new Vector3().fromArray( object.halfExtents );

		return object;

	}

}
