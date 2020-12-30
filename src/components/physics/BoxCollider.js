import { Collider } from "./Collider.js";

export class BoxCollider extends Collider {

	start( data ) {

		this.type = "box";
		super.start( data );

	}

}
