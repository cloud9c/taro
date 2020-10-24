import { Collider } from "./Collider.js";
import { Component } from "../../core/Component.js";

class ConeCollider extends Collider {
	init(data) {
		data.type = "cone";
		super.init(data);
	}
}

Component.createComponent("ConeCollider", ConeCollider);
