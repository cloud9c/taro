import { Collider } from "./Collider.js";

export class CylinderCollider extends Collider {
	init(data) {
		data.type = "cylinder";
		super.init(data);
	}
}
