import { Collider } from "./Collider.js";

export class ConeCollider extends Collider {
	start(data) {
		this.type = "cone";
		super.start(data);
	}
}
