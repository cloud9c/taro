import { Component } from "./Component.js";

import { Input } from "../Input.js";
import { Physics } from "../Physics.js";
import { Time } from "../Time.js";
import { Render } from "../Render.js";

import * as THREE from "../lib/three.module.js";

import { Entity } from "./Entity.js";

const System = {
	init() {
		// input
		Render.canvas.addEventListener("click", () => {
			document.body.requestFullscreen();
			document.body.requestPointerLock();
		});
		console.log(Render.scene);

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
			Render.renderer.setSize(window.innerWidth, window.innerHeight);

			for (let i = 0, len = Render.cameras.length; i < len; i++) {
				Render.cameras[i].aspect =
					(Render.canvas.width * Render.cameras[i].viewport.z) /
					(Render.canvas.height * Render.cameras[i].viewport.w);
				Render.cameras[i].updateProjectionMatrix();
			}
		});

		Input._init();

		// physics
		this.Rigidbody = Component._containers.Rigidbody;

		// render
		Render.renderer.setSize(window.innerWidth, window.innerHeight);

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
			for (let i = 0, len = this.Rigidbody.length; i < len; i++) {
				const rigidbody = this.Rigidbody[i];
				rigidbody.transform.position.copy(rigidbody._ref.getPosition());
				rigidbody.transform.rotation.setFromVector3(
					rigidbody._ref.getRotation().toEulerXyz()
				);
			}
			Physics._world.step(Time.fixedTimestep);
			Physics._accumulator -= Time.fixedTimestep;
		}

		// update loop
		for (let i = 0, len = Component._containers.length; i < len; i++) {
			const container = Component._containers[i];
			if ("update" in container[0]) {
				for (let j = 0, lenj = component.length; j < lenj; j++) {
					component[j].update();
				}
			}
		}

		// render
		Render.render();

		// input
		Input._keyDown = {};
		Input._keyUp = {};
		Input._mouseDown = [];
		Input._mouseUp = [];

		window.requestAnimationFrame((t) => this.updateLoop(t / 1000));
	},
};

export { System };
