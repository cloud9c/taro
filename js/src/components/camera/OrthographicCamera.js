import { Render } from "../../Render.js";
import { Vector4 } from "../../math/Vector4.js";
import { OrthographicCamera as OC } from "../../lib/three.module.js";
import { Component } from "../../core/Component.js";

class OrthographicCamera extends OC {
	init(data) {
		if ("left" in data) this.left = data.left;
		if ("right" in data) this.right = data.right;
		if ("top" in data) this.top = data.top;
		if ("bottom" in data) this.bottom = data.bottom;
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

Component.createComponent("OrthographicCamera", OrthographicCamera);
