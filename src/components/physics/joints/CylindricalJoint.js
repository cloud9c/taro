import { Joint } from "./Joint.js";
import { AngularLimit } from "../../../physics/AngularLimit.js";
import { LinearLimit } from "../../../physics/LinearLimit.js";
import { SpringDamper } from "../../../physics/SpringDamper.js";
import { Vector3 } from "../../../lib/three.js";
import { OIMO } from "../../../lib/oimo.js";

export class CylindricalJoint extends Joint {

	constructor( data ) {

		data.type = "cylindrical";
		super.start( data );

	}

	_addDerivedProperties( data ) {

		this._axis = data.axis !== undefined ? data.axis : new Vector3( 1, 0, 0 );
		this._linkedAxis =
					data.linkedAxis !== undefined ? data.linkedAxis : new Vector3( 1, 0, 0 );

		this.linearLimit = data.linearLimit !== undefined
			? data.linearLimit
			: new LinearLimit();
		this.linearSpringDamper = data.linearSpringDamper !== undefined
			? data.linearSpringDamper
			: new SpringDamper();
		this.angularLimit = data.angularLimit !== undefined
			? data.angularLimit
			: new AngularLimit();
		this.angularSpringDamper = data.angularSpringDamper !== undefined
			? data.angularSpringDamper
			: new SpringDamper();

	}

	_setDerivedJoint( config ) {

		config.localAxis1 = this._axis;
		config.localAxis2 = this._linkedAxis;

		config.translationalLimitMotor = this.linearLimit;
		config.translationalSpringDamper = this.linearSpringDamper;
		config.rotationalLimitMotor = this.angularLimit;
		config.rotationalSpringDamper = this.angularSpringDamper;
		this._ref = new OIMO.CylindricalJoint( config );

	}

	toJSON() {

		const object = super.toJSON();

		object.axis = this._axis.toArray();
		object.linkedAxis = this._linkedAxis.toArray();

		object.linearLimit = this.linearLimit;
		object.linearSpringDamper = this.linearSpringDamper;
		object.angularLimit = this.angularLimit;
		object.angularSpringDamper = this.angularSpringDamper;

		return object;

	}

	fromJSON( object ) {

		object = super.fromJSON( object );

		object.axis = new Vector3().fromArray( object.axis );
		object.linkedAxis = new Vector3().fromArray( object.linkedAxis );

		object.linearLimit = Object.create( LinearLimit, object.linearLimit );
		object.linearSpringDamper = Object.create( SpringDamper, object.linearSpringDamper );
		object.angularLimit = Object.create( AngularLimit, object.angularLimit );
		object.angularSpringDamper = Object.create( SpringDamper, object.angularSpringDamper );

		return object;

	}

}
