import { Collider } from "./Collider.js";
import { Component } from "../../core/Component.js";

class BoxCollider extends Collider {
	init(data) {
		data.type = "box";
		super.init(data);
	}
}

Component.createComponent("BoxCollider", BoxCollider);
