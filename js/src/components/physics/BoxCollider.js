import { Collider } from "./Collider.js";

class BoxCollider extends Collider {
	init(data) {
		data.type = "box";
		super.init(data);
	}
}

export { BoxCollider };
