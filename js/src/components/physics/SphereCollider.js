import { Collider } from "./Collider.js";

class SphereCollider extends Collider {
	init(data) {
		data.type = "sphere";
		super.init(data);
	}
}

ENGINE.createComponent("SphereCollider", SphereCollider);
