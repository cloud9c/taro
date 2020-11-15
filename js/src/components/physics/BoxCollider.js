import { Collider } from "./Collider.js";

export class BoxCollider extends Collider {
	init(data) {
		data.type = "box";
		super.init(data);
	}
}
