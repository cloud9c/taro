import { PerspectiveCamera as PC } from "../../lib/three.js";
import { Vector4 } from "../../engine.js";

export class PerspectiveCamera extends PC {
	start(data) {
		this._region = new Vector4();
		this.autoAspect = true;

		if ("fov" in data) this.fov = data.fov;
		if ("near" in data) this.near = data.near;
		if ("far" in data) this.far = data.far;
		this.viewport =
			"viewport" in data ? data.viewport : new Vector4(0, 0, 1, 1);
		if ("aspect" in data) this.aspect = data.aspect;

		this._onResize(this.entity.scene.app.canvas);

		if (!this.autoAspect) this.updateProjectionMatrix();

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

	_onResize(canvas) {
		const view = this.viewport;
		if (this.autoAspect) {
			this._aspect = (canvas.width * view.z) / (canvas.height * view.w);
			this.updateProjectionMatrix();
		}
		this._region.set(
			canvas.width * view.x,
			canvas.height * view.y,
			canvas.width * view.z,
			canvas.height * view.w
		);
	}

	get aspect() {
		return this._aspect;
	}

	set aspect(x) {
		this.autoAspect = false;
		this._aspect = x;
	}
}
