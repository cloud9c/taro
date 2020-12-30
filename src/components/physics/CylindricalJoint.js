import { Joint } from "./Joint.js";

export class CylindricalJoint extends Joint {

	start( data ) {

		this.type = "cylindrical";
		super.start( data );

	}

}
