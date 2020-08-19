import { Collider } from "./Collider.js";

class ConeCollider extends Collider {
	init(data) {
		data.type = "cone";
		super.init(data);
	}
}

export { ConeCollider };
