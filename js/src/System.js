import * as THREE from "./lib/three.module.js";
import OIMO from "./lib/oimoPhysics.js";
import Component from "./Component.js";
import { Color, Quaternion } from "./engine.js";
import Input from "./Input.js";

const System = {
	init: function (canvas) {
		this.canvas = document.getElementById(canvas);

		// behavior
		this.Behavior = Component.components.Behavior;

		// camera
		this.Camera = Component.components.Camera;
		this.cameras = new THREE.ArrayCamera();

		// input
		this.canvas.addEventListener("click", () => {
			document.body.requestFullscreen();
			document.body.requestPointerLock();
		});

		window.addEventListener("blur", () => {
			for (const property in Input) {
				if (typeof Input[property] === "boolean")
					Input[property] = false;
				else if (typeof Input[property] === "number")
					Input[property] = 0;
			}
			this.lastTimestamp = undefined;
		});

		window.addEventListener("resize", () => {
			this.cameras.aspect = this.canvas.width / this.canvas.height;
			this.cameras.updateProjectionMatrix();
			this.renderer.setSize(this.canvas.width, this.canvas.height);
		});

		document.addEventListener("mousemove", (event) => {
			Input.MouseX = event.movementX;
			Input.MouseY = event.movementY;
		});
		document.addEventListener("wheel", () => {
			Input.WheelX = event.wheelDeltaX;
			Input.WheelY = event.wheelDeltaY;
		});
		document.addEventListener("keydown", () => {
			if (event.repeat) return;

			Input[event.code] = true;
		});
		document.addEventListener("keyup", () => {
			Input[event.code] = false;
		});

		// physics
		this.accumulator = 0;
		this.Rigidbody = Component.components.Rigidbody;
		this.UPDATE_PERIOD = 0.01;
		this.alpha = 0;

		this.world = new OIMO.World(2);
		this.world.setNumPositionIterations(8);
		this.world.setNumVelocityIterations(8);

		// render
		const scene = new THREE.Scene();
		scene.background = new Color(0x0080ff);
		this.scene = scene;
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.Object3D = Component.components.Object3D;
		this.Transform = Component.components.Transform;

		this.lastTimestamp = undefined;
	},
	updateLoop: function (timestamp) {
		timestamp /= 1000;
		const dt = timestamp - this.lastTimestamp || 0;
		this.lastTimestamp = timestamp;

		// physics
		this.accumulator += dt > 0.25 ? 0.25 : dt;

		while (this.accumulator >= this.UPDATE_PERIOD) {
			for (let i = 0, len = this.Rigidbody.length; i < len; i++) {
				this.Rigidbody[i]._update();
			}
			this.world.step(this.UPDATE_PERIOD);
			this.accumulator -= this.UPDATE_PERIOD;
		}

		this.alpha = this.accumulator / this.UPDATE_PERIOD;

		// input - resets delta movements
		Input.MouseX = Input.MouseY = Input.WheelX = Input.WheelY = 0;

		// camera
		for (let i = 0, len = this.Camera.length; i < len; i++) {
			this.Camera[i]._updateTransform();
		}

		// render
		for (let i = 0, len = this.Object3D.length; i < len; i++) {
			const obj = this.Object3D[i];
			const transform = obj.entity.Transform;
			const alpha = this.alpha;

			// physics interpolation
			if (
				obj.entity.hasOwnProperty("Rigidbody") &&
				obj.entity.Rigidbody.interpolate
			) {
				const _previousState = obj.entity.Rigidbody._previousState;

				obj.position.copy(
					transform._position
						.clone()
						.lerp(_previousState.position, alpha)
				);

				obj.rotation.setFromQuaternion(
					new Quaternion()
						.setFromEuler(transform._rotation)
						.slerp(
							new Quaternion().setFromEuler(
								_previousState.rotation
							),
							alpha
						)
				);
			} else {
				obj.position.copy(transform._position);
				obj.rotation.copy(transform._rotation);
			}
			obj.scale.copy(transform._scale);
		}
		this.renderer.render(this.scene, this.cameras);

		window.requestAnimationFrame((t) => this.updateLoop(t));
	},
	// animation: {
	// 	init() {
	// 		this.animations = Component.components.Animation;
	// 	},
	// 	update() {
	// 		for (const entity in this.animations) {
	// 			this.animations[entity].mixer.update();
	// 		}
	// 	},
	// },
	// camera: {
	// thirdPersonMode() {
	// 	const camera = this.camera;
	// 	this.firstPerson = false;
	// 	if (!this.renderFirstPerson)
	// 		camera.parent.traverse((node) => {
	// 			if (node.material) {
	// 				node.material.colorWrite = true;
	// 				node.material.depthWrite = true;
	// 			}
	// 		});
	// 	camera.position.set(-2, 10, -15);
	// 	camera.rotation.set((-160 * Math.PI) / 180, 0, Math.PI);
	// 	this.cameraRadius = Math.sqrt(
	// 		camera.position.z * camera.position.z +
	// 			camera.position.y * camera.position.y
	// 	);
	// 	this.cameraArc = Math.acos(-camera.position.z / this.cameraRadius);
	// 	camera.zoom = 1.65;
	// },
	// firstPersonMode() {
	// 	const camera = this.camera;
	// 	this.firstPerson = true;
	// 	if (!this.renderFirstPerson)
	// 		camera.parent.traverse((node) => {
	// 			if (node.material) {
	// 				node.material.colorWrite = false;
	// 				node.material.depthWrite = false;
	// 			}
	// 		});
	// 	camera.position.set(0, 4, 0);
	// 	camera.rotation.set(0, Math.PI, 0);
	// 	camera.zoom = 1;
	// },
	// setTarget(target, firstPerson = true, renderFirstPerson = false) {
	// 	target.Object3D.add(this.camera);

	// 	this.target = target;

	// 	this.renderFirstPerson = renderFirstPerson;

	// 	if (firstPerson) this.firstPersonMode();
	// 	else this.thirdPersonMode();
	// },
	// update() {
	// if (input.MouseX != 0) {
	// 	// temp solution
	// 	const newRot = this.target.transform.getRotation();
	// 	newRot.y -= input.MouseX;
	// 	this.target.transform.setRotation(newRot);
	// }

	// if (input.MouseY != 0) {
	// 	if (this.firstPerson) {
	// 		const newX = camera.rotation.x - input.MouseY;
	// 		if (newX < 1.5 && newX > -1.5) camera.rotation.x = newX;
	// 	} else {
	// 		const newCameraArc = this.cameraArc + input.MouseY;
	// 		if (newCameraArc < 1.1 && newCameraArc > 0.1) {
	// 			const newX = camera.rotation.x + input.MouseY;
	// 			this.cameraArc = newCameraArc;
	// 			camera.position.z =
	// 				-Math.cos(newCameraArc) * this.cameraRadius;
	// 			camera.position.y =
	// 				Math.sin(newCameraArc) * this.cameraRadius;
	// 			camera.rotation.x = newX;
	// 		}
	// 	}
	// }

	// if (input.WheelY != 0) {
	// 	if (input.WheelY < 0) {
	// 		camera.zoom = Math.max(camera.zoom - 0.05, 1);
	// 		if (this.firstPerson) {
	// 			this.thirdPersonMode();
	// 		}
	// 	} else {
	// 		const newZoom = camera.zoom + 0.05;
	// 		if (!this.firstPerson) {
	// 			if (camera.zoom >= 1.65) {
	// 				this.firstPersonMode();
	// 			} else {
	// 				camera.zoom = Math.min(newZoom, 1.65);
	// 			}
	// 		}
	// 	}
	// 	camera.updateProjectionMatrix();
	// }
	// },
	// },
};

export default System;
