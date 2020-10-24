import { Collider } from "./Collider.js";
import { Component } from "../../core/Component.js";

class SphereCollider extends Collider {
	init(data) {
		data.type = "sphere";
		super.init(data);
	}
}

Component.createComponent("SphereCollider", SphereCollider);
