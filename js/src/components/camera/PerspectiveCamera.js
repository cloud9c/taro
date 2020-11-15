import { PerspectiveCamera as TPC } from "../../lib/three.module.js";
import { Vector4 } from "../../engine.js";

export class PerspectiveCamera extends TPC {
	init(data) {
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
	}

	get aspect() {
		return this._aspect;
	}

	set aspect(x) {
		this.autoAspect = false;
		this._aspect = x;
	}

	onEnable() {
		this.entity.scene.cameras.push(this);
		this.entity.add(this);
	}

	onDisable() {
		this.entity.scene.cameras.splice(
			this.entity.scene.cameras.indexOf(this),
			1
		);
		this.entity.remove(this);
	}
}
