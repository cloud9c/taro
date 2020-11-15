import { Collider } from "./Collider.js";

export class SphereCollider extends Collider {
	init(data) {
		data.type = "sphere";
		super.init(data);
	}
}
