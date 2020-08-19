import { Collider } from "./Collider.js";

class SphereCollider extends Collider {
	init(data) {
		data.type = "sphere";
		super.init(data);
	}
}

export { SphereCollider };
