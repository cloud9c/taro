import { Render } from "../Render.js";
import { Component } from "../core/Component.js";
import { Group } from "../lib/three.module.js";

class Transform extends Group {
	init(data) {
		if ("position" in data) this.position.copy(data.position);
		if ("rotation" in data) this.rotation.copy(data.rotation);
		if ("scale" in data) this.scale.copy(data.scale);

		Render.scene.add(this);
	}
}

Component.createComponent("Transform", Transform);
