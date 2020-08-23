import { Component } from "./Component.js";

import { Input } from "../Input.js";
import { Physics } from "../Physics.js";
import { Time } from "../Time.js";
import { Render } from "../Render.js";

const System = {
	init() {
		// behavior
		this.Behavior = Component._containers.Behavior;

		// camera
		this.Camera = Component._containers.Camera;

		// input
		Render.canvas.addEventListener("click", () => {
			document.body.requestFullscreen();
			document.body.requestPointerLock();
		});
		console.log(Render.scene);
		console.log(Render.cameras);

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
			Render.cameras.aspect = Render.canvas.width / Render.canvas.height;
			Component._containers.Camera[0].setViewport(
				0,
				0,
				window.innerWidth,
				window.innerHeight
			);
			Render.cameras.updateProjectionMatrix();
			Render.renderer.setSize(window.innerWidth, window.innerHeight);
		});

		Input._init();

		// physics
		this.Rigidbody = Component._containers.Rigidbody;

		// render
		Render.renderer.setSize(window.innerWidth, window.innerHeight);
		this.Object3D = Component._containers.Object3D;
		this.Transform = Component._containers.Transform;

		// updates
		this._updates = Component._updates;
		this._fixedUpdates = Component._fixedUpdates;
		this._lateUpdates = Component._lateUpdates;

		this.lastTimestamp = undefined;
	},
	updateLoop(timestamp) {
		Time.deltaTime = timestamp - this.lastTimestamp || 0;
		this.lastTimestamp = timestamp;

		// fixed update - physics
		Physics._accumulator +=
			Time.deltaTime > Time.maxTimestep
				? Time.maxTimestep
				: Time.deltaTime;
		while (Physics._accumulator >= Time.fixedTimestep) {
			for (let i = 0, len = this._fixedUpdates.length; i < len; i++) {
				const component = this._fixedUpdates[i];
				for (let j = 0, lenj = component.length; j < lenj; j++) {
					component[j].fixedUpdate();
				}
			}

			for (let i = 0, len = this.Rigidbody.length; i < len; i++) {
				const rigidbody = this.Rigidbody[i];
				rigidbody._position.copy(rigidbody._ref.getPosition());
				rigidbody._rotation.setFromVector3(
					rigidbody._ref.getRotation().toEulerXyz()
				);
			}
			Physics._world.step(Time.fixedTimestep);
			Physics._accumulator -= Time.fixedTimestep;
		}

		for (let i = 0, len = this._updates.length; i < len; i++) {
			const component = this._updates[i];
			for (let j = 0, lenj = component.length; j < lenj; j++) {
				component[j].update();
			}
		}

		for (let i = 0, len = this._lateUpdates.length; i < len; i++) {
			const component = this._lateUpdates[i];
			for (let j = 0, lenj = component.length; j < lenj; j++) {
				component[j].lateUpdate();
			}
		}

		// camera
		for (let i = 0, len = this.Camera.length; i < len; i++) {
			this.Camera[i]._updateTransform();
		}

		// render
		for (let i = 0, len = this.Object3D.length; i < len; i++) {
			const obj = this.Object3D[i];
			const transform = obj.entity.transform;

			obj.position.copy(transform._position);
			obj.rotation.copy(transform._rotation);
			obj.scale.copy(transform._scale);
		}
		Render.renderer.render(Render.scene, Render.cameras.cameras[0]);

		// input
		Input._keyDown = {};
		Input._keyUp = {};
		Input._mouseDown = [];
		Input._mouseUp = [];

		window.requestAnimationFrame((t) => this.updateLoop(t / 1000));
	},
	// animation: {
	// 	init() {
	// 		this.animations = Component._containers.Animation;
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

export { System };
