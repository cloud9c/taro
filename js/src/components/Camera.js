import { Render } from "../Render.js";
import { Vector4 } from "../math/Vector4.js";
import { PerspectiveCamera, OrthographicCamera } from "../lib/three.module.js";

class Camera {
	init(data) {
		this._position = this.entity.transform._position;
		this._rotation = this.entity.transform._rotation;

		this.type = data.hasOwnProperty("type") ? data.type : "perspective";
		if (this.type === "perspective") {
			this._ref = new PerspectiveCamera(
				data.hasOwnProperty("fov") ? data.fov : 60,
				data.hasOwnProperty("aspect")
					? data.aspect
					: Render.canvas.width / Render.canvas.height,
				data.hasOwnProperty("near") ? data.near : 0.1,
				data.hasOwnProperty("far") ? data.far : 1000
			);
		} else {
			this._ref = new OrthographicCamera(
				data.hasOwnProperty("left") ? data.left : -1,
				data.hasOwnProperty("right") ? data.right : 1,
				data.hasOwnProperty("top") ? data.top : 1,
				data.hasOwnProperty("bottom") ? data.bottom : -1,
				data.hasOwnProperty("near") ? data.near : 0.1,
				data.hasOwnProperty("far") ? data.far : 1000
			);
		}
		this.setViewPort(
			data.hasOwnProperty("viewport")
				? data.viewport
				: new Vector4(0, 0, 1, 1)
		);
		this._enabled = data.hasOwnProperty("enabled") ? data.enabled : true;
		if (this._enabled) {
			this._index = Render.cameras.cameras.length;
			Render.cameras.cameras.push(this._ref);
		}
	}

	get enabled() {
		return this._enabled;
	}

	set enabled(v) {
		if (v !== this._enabled) {
			this._enabled = v;
			if (this._enabled) {
				this._index = Render.cameras.cameras.length;
				Render.cameras.cameras.push(this._ref);
			} else {
				Render.cameras.cameras.splice(this._index, 1);
			}
		}
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
