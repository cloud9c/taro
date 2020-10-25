import { Component } from "../core/Component.js";
import { Object3D } from "../lib/three.module.js";

class Mesh extends Object3D {
	init(data) {
		Object.assign(this, data);
	}

	onEnable() {
		this.transform.add(this);
	}

	onDisable() {
		this.transform.remove(this);
	}
}

Component.createComponent("Mesh", Mesh);
