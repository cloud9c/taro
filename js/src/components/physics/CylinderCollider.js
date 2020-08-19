import { Collider } from "./Collider.js";

class CylinderCollider extends Collider {
	init(data) {
		data.type = "cylinder";
		super.init(data);
	}
}

export { CylinderCollider };
