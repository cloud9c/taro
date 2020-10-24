import { Collider } from "./Collider.js";
import { Component } from "../../core/Component.js";

class CylinderCollider extends Collider {
	init(data) {
		data.type = "cylinder";
		super.init(data);
	}
}

Component.createComponent("CylinderCollider", CylinderCollider);
