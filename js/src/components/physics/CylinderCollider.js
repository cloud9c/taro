import { Collider } from "./Collider.js";

export class CylinderCollider extends Collider {
	start(data) {
		this.type = "cylinder";
		super.start(data);
	}
}
