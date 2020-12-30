import { Collider } from "./Collider.js";

export class CapsuleCollider extends Collider {

	start( data ) {

		this.type = "capsule";
		super.start( data );

	}

}
