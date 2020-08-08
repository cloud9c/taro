import * as THREE from "./three.module.js";
import OIMO from "./oimoPhysics.js";
import Component from "./component.js";
import { Color, Quaternion } from "./engine.js";

const System = {
	init(canvas) {
		this.canvas = document.getElementById(canvas);

		this.behavior.init();
		this.camera.init();
		this.input.init();
		this.physics.init();
		this.render.init();

		this.lastTimestamp = undefined;
	},
	gameLoop(timestamp) {
		timestamp /= 1000;
		const dt = timestamp - System.lastTimestamp || 0;
		System.lastTimestamp = timestamp;

		// custom updates
		System.behavior.update();

		// physics-y stuff
		System.physics.update(dt);

		// rendering info
		System.camera.update();
		System.render.update();

		// resets delta movements
		System.input.update();

		window.requestAnimationFrame(System.gameLoop);
	},
	animation: {
		init() {
			this.animations = Component.components.animation;
		},
		update() {
			for (const entity in this.animations) {
				this.animations[entity].mixer.update();
			}
		},
	},
	behavior: {
		init() {
			this.behaviors = Component.components.behavior;
		},
		update() {
			for (const entity in this.behaviors) {
				this.behaviors[entity]();
			}
		},
	},
	camera: {
		init() {
			// this.camera = new THREE.PerspectiveCamera(
			// 	45,
			// 	window.innerWidth / window.innerHeight,
			// 	1,
			// 	1000
			// );
			// this.target = null;
			this._cameras = Component.components.camera;
			this.cameras = new THREE.ArrayCamera();
		},
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
		update() {
			const keyInput = System.input.keyInput;

			for (const entity in this._cameras) {
				this._cameras[entity]._updateTransform();
			}

			// if (keyInput.MouseX != 0) {
			// 	// temp solution
			// 	const newRot = this.target.transform.getRotation();
			// 	newRot.y -= keyInput.MouseX;
			// 	this.target.transform.setRotation(newRot);
			// }

			// if (keyInput.MouseY != 0) {
			// 	if (this.firstPerson) {
			// 		const newX = camera.rotation.x - keyInput.MouseY;
			// 		if (newX < 1.5 && newX > -1.5) camera.rotation.x = newX;
			// 	} else {
			// 		const newCameraArc = this.cameraArc + keyInput.MouseY;
			// 		if (newCameraArc < 1.1 && newCameraArc > 0.1) {
			// 			const newX = camera.rotation.x + keyInput.MouseY;
			// 			this.cameraArc = newCameraArc;
			// 			camera.position.z =
			// 				-Math.cos(newCameraArc) * this.cameraRadius;
			// 			camera.position.y =
			// 				Math.sin(newCameraArc) * this.cameraRadius;
			// 			camera.rotation.x = newX;
			// 		}
			// 	}
			// }

			// if (keyInput.WheelY != 0) {
			// 	if (keyInput.WheelY < 0) {
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
		},
	},
	input: {
		init() {
			const keyInput = {
				MouseX: 0,
				MouseY: 0,
				WheelX: 0,
				WheelY: 0,
			};

			System.canvas.addEventListener("click", () => {
				document.body.requestFullscreen();
				document.body.requestPointerLock();
			});

			window.addEventListener("blur", () => {
				for (const property in keyInput) {
					if (typeof keyInput[property] === "boolean")
						keyInput[property] = false;
					else if (typeof keyInput[property] === "number")
						keyInput[property] = 0;
				}
				System.lastTimestamp = undefined;
			});

			window.addEventListener("resize", () => {
				System.camera.cameras.aspect =
					System.canvas.width / System.canvas.height;
				System.camera.cameras.updateProjectionMatrix();
				System.render.renderer.setSize(
					System.canvas.width,
					System.canvas.height
				);
			});

			document.addEventListener("mousemove", (event) => {
				keyInput.MouseX = event.movementX;
				keyInput.MouseY = event.movementY;
			});
			document.addEventListener("wheel", () => {
				keyInput.WheelX = event.wheelDeltaX;
				keyInput.WheelY = event.wheelDeltaY;
			});
			document.addEventListener("keydown", () => {
				if (event.repeat) return;

				keyInput[event.code] = true;
			});
			document.addEventListener("keyup", () => {
				keyInput[event.code] = false;
			});

			this.keyInput = keyInput;
		},
		update() {
			const keyInput = this.keyInput;
			keyInput.MouseX = keyInput.MouseY = keyInput.WheelX = keyInput.WheelY = 0;
		},
	},
	physics: {
		init() {
			this.accumulator = 0;
			this.rigidbodies = Component.components.rigidbody;
			this.UPDATE_PERIOD = 0.01;
			this.alpha = 0;

			this.world = new OIMO.World(2);
			this.world.setNumPositionIterations(8);
			this.world.setNumVelocityIterations(8);
		},
		update(dt) {
			// https://gafferongames.com/post/fix_your_timestep/
			this.accumulator += dt > 0.25 ? 0.25 : dt;

			while (this.accumulator >= this.UPDATE_PERIOD) {
				for (const entity in this.rigidbodies) {
					const r = this.rigidbodies[entity];

					if (r.interpolate) r._interpolate();
				}
				this.world.step(this.UPDATE_PERIOD);
				this.accumulator -= this.UPDATE_PERIOD;
			}

			this.alpha = this.accumulator / this.UPDATE_PERIOD;
		},
	},
	render: {
		init() {
			const scene = new THREE.Scene();
			scene.background = new Color(0x0080ff);
			this.scene = scene;
			this.camera = System.camera.camera;
			this.renderer = new THREE.WebGLRenderer({
				canvas: System.canvas,
			});
			this.renderer.setSize(window.innerWidth, window.innerHeight);

			this.camera = System.camera.cameras;
			this.object3Ds = Component.components.object3D;
			this.rigidbodies = Component.components.rigidbody;
			this.transforms = Component.components.transform;
		},
		update() {
			for (const entity in this.object3Ds) {
				const obj = this.object3Ds[entity];
				const transform = this.transforms[entity];
				const alpha = System.physics.alpha;

				// physics interpolation
				if (
					this.rigidbodies.hasOwnProperty(entity) &&
					this.rigidbodies[entity].interpolate
				) {
					const _previousState = this.rigidbodies[entity]
						._previousState;

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
			this.renderer.render(this.scene, this.camera);
		},
	},
};

export default System;
