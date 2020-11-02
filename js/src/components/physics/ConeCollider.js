import { Collider } from "./Collider.js";

class ConeCollider extends Collider {
	init(data) {
		data.type = "cone";
		super.init(data);
	}
}

ENGINE.createComponent("ConeCollider", ConeCollider);
