export class Render {
	constructor(app, canvas) {
		this.canvas = app.canvas;
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
		});

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		window.addEventListener("resize", () => {
			this.renderer.setSize(window.innerWidth, window.innerHeight);

			for (let i = 0, len = this.cameras.length; i < len; i++) {
				if (this.cameras[i].autoAspect) {
					console.log(this.cameras[i]._aspect);
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

			this.renderer.setViewport(left, bottom, width, height);
			this.renderer.setScissor(left, bottom, width, height);
			this.renderer.setScissorTest(true);

			this.renderer.render(this.scene, this.cameras[i]);
		}
	}
}
