import { Collider } from "./Collider.js";

export class CapsuleCollider extends Collider {
	init(data) {
		data.type = "capsule";
		super.init(data);
	}
}
