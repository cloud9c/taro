import { PerspectiveCamera as PC } from "../../lib/three.js";
import { Vector4 } from "../../engine.js";

export class PerspectiveCamera extends PC {
	start(data) {
		if ("fov" in data) this.fov = data.fov;
		if ("near" in data) this.near = data.near;
		if ("far" in data) this.far = data.far;

		this.viewport =
			"viewport" in data ? data.viewport : new Vector4(0, 0, 1, 1);
		this.autoAspect = "autoAspect" in data ? data.autoAspect : true;

		const canvas = this.entity.scene.app.canvas;
		if (this.autoAspect) {
			this._aspect =
				(canvas.width * this.viewport.z) /
				(canvas.height * this.viewport.w);
		}
		if ("aspect" in data) this.aspect = data.aspect;
		this.updateProjectionMatrix();

		this.addEventListener("enable", this.onEnable);
		this.addEventListener("disable", this.onDisable);
	}

	onEnable() {
		this.entity.scene._cameras.push(this);
		this.entity.add(this);
	}

	onDisable() {
		this.entity.scene._cameras.splice(
			this.entity.scene._cameras.indexOf(this),
			1
		);
		this.entity.remove(this);
	}

	get aspect() {
		return this._aspect;
	}

	set aspect(x) {
		this.autoAspect = false;
		this._aspect = x;
	}
}
