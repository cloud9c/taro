import * as THREE from "./lib/three.module.js";
const Render = {
	init: function (canvas) {
		this.canvas = document.getElementById(canvas);
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
		});
	},
	scene: new THREE.Scene(),
	cameras: new THREE.ArrayCamera(),
};

export { Render };
