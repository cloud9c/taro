import { Collider } from "./Collider.js";

export class SphereCollider extends Collider {

	start( data ) {

		this.type = "sphere";
		super.start( data );

	}

}
