import { Collider } from './Collider.js';
import { OIMO } from '../../../lib/oimo.js';

export class CylinderCollider extends Collider {

	start( data ) {

		data.type = 'cylinder';
		super.start( data );

	}

	_addDerivedProperties( data ) {

		this._radius = data.radius !== undefined ? data.radius : 0.5;
		this._halfHeight = data.halfHeight !== undefined ? data.halfHeight : 1;

	}

	_setGeometry( scale, max ) {

		return new OIMO.CylinderGeometry(
			this._radius * max,
			this._halfHeight * max
		);

	}

}
