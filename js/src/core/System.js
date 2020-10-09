import { Component } from "./Component.js";

import { Input } from "../Input.js";
import { Physics } from "../Physics.js";
import { Time } from "../Time.js";
import { Render } from "../Render.js";

import * as THREE from "../lib/three.module.js";

import { Entity } from "./Entity.js";

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
		console.log(Render.arrayCamera);

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
			Render.arrayCamera.cameras[0].aspect =
				Render.canvas.width / Render.canvas.height;
			Render.arrayCamera.cameras[0].viewport.set(
				0,
				0,
				window.innerWidth,
				window.innerHeight
			);
			Render.arrayCamera.cameras[0].updateProjectionMatrix();

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

		// render
		Render.renderer.render(Render.scene, Render.arrayCamera);
		if (Entity.find("player").transform.position.x > 5)
			Entity.find("player").transform.position.x = -1;
		else Entity.find("player").transform.position.x += 0.1;

		// input
		Input._keyDown = {};
		Input._keyUp = {};
		Input._mouseDown = [];
		Input._mouseUp = [];

		window.requestAnimationFrame((t) => this.updateLoop(t / 1000));
	},
};

export { System };
