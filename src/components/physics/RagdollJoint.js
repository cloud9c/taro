import { Joint } from "./Joint.js";

export class RagdollJoint extends Joint {

	start( data ) {

		this.type = "ragdoll";
		super.start( data );

	}

}
