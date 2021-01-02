import { Joint } from "./Joint.js";
import { SpringDamper } from "../../../physics/SpringDamper.js";
import { OIMO } from "../../../lib/oimo.js";

export class BallJoint extends Joint {

	constructor( data ) {

		data.type = "ball";
		super.start( data );

	}

	_addDerivedProperties( data ) {

		this.springDamper = data.springDamper !== undefined
			? data.springDamper
			: new SpringDamper();

	}

	_setDerivedJoint( config ) {

		config.springDamper = this.springDamper;
		this._ref = new OIMO.SphericalJoint( config );

	}

	toJSON() {

		const object = super.toJSON();

		object.springDamper = this.springDamper;

		return object;

	}

	fromJSON( object ) {

		object = super.fromJSON( object );

		object.springDamper = Object.create( SpringDamper, object.springDamper );

		return object;

	}

}
