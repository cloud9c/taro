import { WebGLRenderer } from "../lib/three.js";

export class Render extends WebGLRenderer {
	constructor(app, parameters) {
		super(parameters);
		this.canvas = app.canvas;

		this.setPixelRatio(window.devicePixelRatio);
		this.setSize(window.innerWidth, window.innerHeight);

		window.addEventListener("resize", () => {
			this.setSize(window.innerWidth, window.innerHeight);

			for (let i = 0, len = this.cameras.length; i < len; i++) {
				if (this.cameras[i].autoAspect) {
					this.cameras[i]._aspect =
						(this.canvas.width * this.cameras[i].viewport.z) /
						(this.canvas.height * this.cameras[i].viewport.w);
					this.cameras[i].updateProjectionMatrix();
				}
			}
		});
	}
	_update() {
		for (let i = 0, len = this.cameras.length; i < len; i++) {
			const view = this.cameras[i].viewport;

			const left = this.canvas.width * view.x;
			const bottom = this.canvas.height * view.y;
			const width = this.canvas.width * view.z;
			const height = this.canvas.height * view.w;

			this.setViewport(left, bottom, width, height);
			this.setScissor(left, bottom, width, height);
			this.setScissorTest(true);

			this.render(this.scene, this.cameras[i]);
		}
	}
}
