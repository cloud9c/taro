import { Render } from "../../Render.js";
import { Vector4 } from "../../math/Vector4.js";
import { PerspectiveCamera as PC } from "../../lib/three.module.js";
import { Component } from "../../core/Component.js";

class PerspectiveCamera extends PC {
	init(data) {
		if ("fov" in data) this.fov = data.fov;
		this.aspect =
			"aspect" in data
				? data.aspect
				: Render.canvas.width / Render.canvas.height;
		if ("near" in data) this.near = data.near;
		if ("far" in data) this.far = data.far;
		this.updateProjectionMatrix();
		this.viewport =
			"viewport" in data ? data.viewport : new Vector4(0, 0, 1, 1);
	}

	onEnable() {
		Render.cameras.push(this);
		this.transform.add(this);
	}

	onDisable() {
		Render.cameras.splice(Render.cameras.indexOf(this), 1);
		this.transform.remove(this);
	}
}

Component.createComponent("PerspectiveCamera", PerspectiveCamera);
