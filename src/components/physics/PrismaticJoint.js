import { Joint } from "./Joint.js";

export class PrismaticJoint extends Joint {

	start( data ) {

		this.type = "prismatic";
		super.start( data );

	}

}
