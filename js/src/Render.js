import * as THREE from "./lib/three.module.js";
const Render = {
	init: function (canvas) {
		this.canvas = document.getElementById(canvas);
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
	},
	render: function () {
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
	},
	scene: new THREE.Scene(),
	cameras: [],
};

export { Render };
