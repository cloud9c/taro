import { Render } from "../../Render.js";
import { Vector4 } from "../../math/Vector4.js";
import { OrthographicCamera as OC } from "../../lib/three.module.js";

class OrthographicCamera extends OC {
	init(data) {
		if ("left" in data) this.left = data.left;
		if ("right" in data) this.right = data.right;
		if ("top" in data) this.top = data.top;
		if ("bottom" in data) this.bottom = data.bottom;
		if ("near" in data) this.near = data.near;
		if ("far" in data) this.far = data.far;
		this.updateProjectionMatrix();

		Object.defineProperties(this, {
			position: {
				value: this.entity.transform.position,
			},
			rotation: {
				value: this.entity.transform.rotation,
			},
			scale: {
				value: this.entity.transform.scale,
			},
		});

		this.viewport =
			"viewport" in data
				? data.viewport
				: new Vector4(0, 0, window.innerWidth, window.innerHeight);
	}

	onEnable() {
		Render.arrayCamera.cameras.push(this);
		Render.scene.add(this);
	}

	onDisable() {
		Render.arrayCamera.cameras.splice(
			Render.arrayCamera.cameras.indexOf(this),
			1
		);
		Render.scene.remove(this);
	}
}

export { OrthographicCamera };
