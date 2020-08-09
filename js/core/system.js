import * as THREE from "./three.module.js";
import OIMO from "./oimoPhysics.js";
import Component from "./component.js";
import { Color, Quaternion } from "./engine.js";

const System = {
	init(canvas) {
		this.canvas = document.getElementById(canvas);

		// behavior
		this.behaviors = Component.components.behavior;

		// camera
		this._cameras = Component.components.camera;
		this.cameras = new THREE.ArrayCamera();

		// input
		const input = {
			MouseX: 0,
			MouseY: 0,
			WheelX: 0,
			WheelY: 0,
		};

		this.canvas.addEventListener("click", () => {
			document.body.requestFullscreen();
			document.body.requestPointerLock();
		});

		window.addEventListener("blur", () => {
			for (const property in input) {
				if (typeof input[property] === "boolean")
					input[property] = false;
				else if (typeof input[property] === "number")
					input[property] = 0;
			}
			this.lastTimestamp = undefined;
		});

		window.addEventListener("resize", () => {
			this.cameras.aspect = this.canvas.width / this.canvas.height;
			this.cameras.updateProjectionMatrix();
			this.renderer.setSize(this.canvas.width, this.canvas.height);
		});

		document.addEventListener("mousemove", (event) => {
			input.MouseX = event.movementX;
			input.MouseY = event.movementY;
		});
		document.addEventListener("wheel", () => {
			input.WheelX = event.wheelDeltaX;
			input.WheelY = event.wheelDeltaY;
		});
		document.addEventListener("keydown", () => {
			if (event.repeat) return;

			input[event.code] = true;
		});
		document.addEventListener("keyup", () => {
			input[event.code] = false;
		});

		this.input = input;

		// physics
		this.accumulator = 0;
		this.rigidbodies = Component.components.rigidbody;
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
		this.object3Ds = Component.components.object3D;
		this.rigidbodies = Component.components.rigidbody;
		this.transforms = Component.components.transform;

		this.lastTimestamp = undefined;
	},
	gameLoop(timestamp) {
		timestamp /= 1000;
		const dt = timestamp - System.lastTimestamp || 0;
		System.lastTimestamp = timestamp;

		// behavior
		for (const entity in System.behaviors) {
			System.behaviors[entity]();
		}

		// physics
		System.accumulator += dt > 0.25 ? 0.25 : dt;

		while (System.accumulator >= System.UPDATE_PERIOD) {
			for (const entity in System.rigidbodies) {
				System.rigidbodies[entity]._update();
			}
			System.world.step(System.UPDATE_PERIOD);
			System.accumulator -= System.UPDATE_PERIOD;
		}

		System.alpha = System.accumulator / System.UPDATE_PERIOD;

		// input - resets delta movements
		const input = System.input;
		input.MouseX = input.MouseY = input.WheelX = input.WheelY = 0;

		// camera
		for (const entity in System._cameras) {
			System._cameras[entity]._updateTransform();
		}

		// render
		for (const entity in System.object3Ds) {
			const obj = System.object3Ds[entity];
			const transform = System.transforms[entity];
			const alpha = System.alpha;

			// physics interpolation
			if (
				System.rigidbodies.hasOwnProperty(entity) &&
				System.rigidbodies[entity].interpolate
			) {
				const _previousState =
					System.rigidbodies[entity]._previousState;

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
		System.renderer.render(System.scene, System.cameras);

		window.requestAnimationFrame(System.gameLoop);
	},
	// animation: {
	// 	init() {
	// 		this.animations = Component.components.animation;
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
	// 	target.object3D.add(this.camera);

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
