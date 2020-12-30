import { Joint } from "./Joint.js";

export class HingeJoint extends Joint {

	start( data ) {

		this.type = "hinge";
		super.start( data );

	}

}
