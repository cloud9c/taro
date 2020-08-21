import { Render } from "../Render.js";
import { Vector4 } from "../math/Vector4.js";
import { PerspectiveCamera, OrthographicCamera } from "../lib/three.module.js";

class Camera {
	init(data) {
		this._position = this.entity.transform._position;
		this._rotation = this.entity.transform._rotation;

		this.projection =
			"projection" in data ? data.projection : "perspective";
		if (this.projection === "perspective") {
			this._ref = new PerspectiveCamera(
				"fov" in data ? data.fov : 60,
				"aspect" in data
					? data.aspect
					: Render.canvas.width / Render.canvas.height,
				"near" in data ? data.near : 0.1,
				"far" in data ? data.far : 1000
			);
		} else {
			this._ref = new OrthographicCamera(
				"left" in data ? data.left : -1,
				"right" in data ? data.right : 1,
				"top" in data ? data.top : 1,
				"bottom" in data ? data.bottom : -1,
				"near" in data ? data.near : 0.1,
				"far" in data ? data.far : 1000
			);
		}
		this.setViewPort(
			"viewport" in data ? data.viewport : new Vector4(0, 0, 1, 1)
		);
	}

	onEnable() {
		Render.cameras.cameras.push(this._ref);
	}

	onDisable() {
		Render.cameras.cameras.splice(
			Render.cameras.cameras.indexOf(this._ref),
			1
		);
	}

	update() {
		console.log(this._ref.position);
	}

	_updateTransform() {
		this._ref.position.copy(this._position);
		this._ref.rotation.copy(this._rotation);
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

	getViewport() {
		return this._ref.viewport;
	}

	setViewPort(v) {
		v.x *= Render.canvas.width;
		v.y *= Render.canvas.height;
		v.z *= Render.canvas.width;
		v.w *= Render.canvas.height;
		this._ref.viewport = v;
	}
}

export { Camera };
