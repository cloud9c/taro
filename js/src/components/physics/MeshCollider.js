import { Collider } from "./Collider.js";

export class MeshCollider extends Collider {
	start(data) {
		this.type = "mesh";
		super.start(data);
	}
}
