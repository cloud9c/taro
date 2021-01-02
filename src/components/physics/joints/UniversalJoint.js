import { Joint } from "./Joint.js";
import { AngularLimit } from "../../../physics/AngularLimit.js";
import { SpringDamper } from "../../../physics/SpringDamper.js";
import { Vector3 } from "../../../lib/three.js";
import { OIMO } from "../../../lib/oimo.js";

export class UniversalJoint extends Joint {

	start( data ) {

		data.type = "universal";
		super.start( data );

	}

	_addDerivedProperties( data ) {

		this._axis = data.axis !== undefined ? data.axis : new Vector3( 1, 0, 0 );
		this._linkedAxis =
					data.linkedAxis !== undefined ? data.linkedAxis : new Vector3( 1, 0, 0 );

		this.springDamper = data.springDamper !== undefined
			? data.springDamper
			: new SpringDamper();
		this.linkedSpringDamper = data.linkedSpringDamper !== undefined
			? data.linkedSpringDamper
			: new SpringDamper();
		this.angularLimit = data.angularLimit !== undefined
			? data.angularLimit
			: new AngularLimit();
		this.linkedAngularLimit = data.linkedAngularLimit !== undefined
			? data.linkedAngularLimit
			: new AngularLimit();

	}

	_setDerivedJoint( config ) {

		config.localAxis1 = this._axis;
		config.localAxis2 = this._linkedAxis;

		config.springDamper1 = this.springDamper;
		config.springDamper2 = this.linkedSpringDamper;
		config.limitMotor1 = this.angularLimit;
		config.limitMotor2 = this.linkedAngularLimit;
		this._ref = new OIMO.UniversalJoint( config );

	}

	toJSON() {

		const object = super.toJSON();

		object.axis = new Vector3().fromArray( object.axis );
		object.linkedAxis = new Vector3().fromArray( object.linkedAxis );

		object.springDamper = this.springDamper;
		object.linkedSpringDamper = this.linkedSpringDamper;

		object.angularLimit = this.angularLimit;
		object.linkedAngularLimit = this.linkedAngularLimit;

		return object;

	}

	fromJSON( object ) {

		object = super.fromJSON( object );

		object.axis = new Vector3().fromArray( object.axis );
		object.linkedAxis = new Vector3().fromArray( object.linkedAxis );

		object.springDamper = Object.create( SpringDamper, object.springDamper );
		object.linkedSpringDamper = Object.create( SpringDamper, object.linkedSpringDamper );

		object.angularLimit = Object.create( AngularLimit, object.angularLimit );
		object.linkedAngularLimit = Object.create( AngularLimit, object.linkedAngularLimit );

		return object;

	}

}
