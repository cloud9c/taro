import { Render } from "../Render.js";
import { Vector4 } from "../math/Vector4.js";
import { PerspectiveCamera, OrthographicCamera } from "../lib/three.module.js";

class Camera {
	init(data) {
		this.projection =
			"projection" in data ? data.projection : "perspective";

		this._ref =
			this.projection === "perspective"
				? (this._ref = new PerspectiveCamera(
						"fov" in data ? data.fov : 60,
						"aspect" in data
							? data.aspect
							: Render.canvas.width / Render.canvas.height,
						"near" in data ? data.near : 0.1,
						"far" in data ? data.far : 1000
				  ))
				: new OrthographicCamera(
						"left" in data ? data.left : -1,
						"right" in data ? data.right : 1,
						"top" in data ? data.top : 1,
						"bottom" in data ? data.bottom : -1,
						"near" in data ? data.near : 0.1,
						"far" in data ? data.far : 1000
				  );

		Object.defineProperties(this._ref, {
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

		this.viewport = this._ref.viewport = new Vector4(
			0,
			0,
			window.innerWidth,
			window.innerHeight
		);
	}

	onEnable() {
		Render.arrayCamera.cameras.push(this._ref);
	}

	onDisable() {
		Render.arrayCamera.cameras.splice(
			Render.arrayCamera.cameras.indexOf(this._ref),
			1
		);
	}

	get aspect() {
		return this._ref.aspect;
	}

	set aspect(v) {
		this._ref.aspect = v;
	}

	get far() {
		return this._ref.far;
	}

	set far(v) {
		this._ref.far = v;
	}

	get filmGauge() {
		return this._ref.filmGauge;
	}

	set filmGauge(v) {
		this._ref.filmGauge = v;
	}

	get filmOffset() {
		return this._ref.filmOffset;
	}

	set filmOffset(v) {
		this._ref.filmOffset = v;
	}

	get focalLength() {
		return this._ref.getFocalLength();
	}

	set focalLength(v) {}

	get focus() {
		return this._ref.focus;
	}

	set focus(v) {
		this._ref.focus = v;
	}

	get fov() {
		return this._ref.fov;
	}

	set fov(v) {
		this._ref.fov = v;
	}

	get near() {
		return this._ref.near;
	}

	set near(v) {
		this._ref.near = v;
	}

	get view() {
		return this._ref.view;
	}

	get zoom() {
		return this._ref.zoom;
	}

	set zoom(v) {
		this._ref.zoom = v;
	}

	get effectiveFOV() {
		return this._ref.getEffectiveFOV();
	}

	get filmHeight() {
		return this._ref.getFilmHeight();
	}

	get filmWidth() {
		return this._ref.getFilmWidth();
	}

	clearViewOffset() {
		this._ref.clearViewOffset();
	}

	setViewOffset(fullWidth, fullHeight, x, y, width, height) {
		this._ref.setViewOffset(fullWidth, fullHeight, x, y, width, height);
	}

	updateProjectionMatrix() {
		this._ref.updateProjectionMatrix();
	}
}

export { Camera };
