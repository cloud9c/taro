import { Collider } from "./Collider.js";
import { Component } from "../../core/Component.js";

class CapsuleCollider extends Collider {
	init(data) {
		data.type = "capsule";
		super.init(data);
	}
}

Component.createComponent("CapsuleCollider", CapsuleCollider);
