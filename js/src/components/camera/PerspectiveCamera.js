import { Render } from "../../core/Render.js";

class PerspectiveCamera extends THREE.PerspectiveCamera {
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
			"viewport" in data ? data.viewport : new ENGINE.Vector4(0, 0, 1, 1);
	}

	onEnable() {
		Render.cameras.push(this);
		this.entity.add(this);
	}

	onDisable() {
		Render.cameras.splice(Render.cameras.indexOf(this), 1);
		this.entity.remove(this);
	}
}

ENGINE.createComponent("PerspectiveCamera", PerspectiveCamera);
