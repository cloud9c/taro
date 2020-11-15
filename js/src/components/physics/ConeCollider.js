import { Collider } from "./Collider.js";

export class ConeCollider extends Collider {
	init(data) {
		data.type = "cone";
		super.init(data);
	}
}
