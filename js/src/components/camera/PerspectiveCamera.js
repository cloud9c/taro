import { Render } from "../../Render.js";
import { Vector4 } from "../../math/Vector4.js";
import { PerspectiveCamera as PC } from "../../lib/three.module.js";

class PerspectiveCamera extends PC {
	init(data) {
		if ("fov" in data) this.fov = data.fov;
		this.aspect = "aspect" in data
			? data.aspect
			: Render.canvas.width / Render.canvas.height;
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
				: new Vector4(0, 0, 1, 1);
	}

	onEnable() {
		Render.cameras.push(this);
		Render.scene.add(this);
	}

	onDisable() {
		Render.cameras.splice(
			Render.cameras.indexOf(this),
			1
		);
		Render.scene.remove(this);
	}
}

export { PerspectiveCamera };
