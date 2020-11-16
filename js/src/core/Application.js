import { Physics } from "./Physics.js";
import { Render } from "./Render.js";
import { Time } from "./Time.js";
import { Scene } from "./Scene.js";
import { Input } from "./Input.js";

export class Application {
	constructor(canvas) {
		this.canvas = document.getElementById(canvas);
		this.time = new Time();
		this.physics = new Physics();
		this.physics.time = this.time;
		this.render = new Render(this, canvas);
		this.input = new Input();
		this.lastTimestamp = undefined;

		this._scenes = {};

		this.createScene("Untitled Scene");
		this.setScene("Untitled Scene");
	}
	start() {
		window.requestAnimationFrame((t) => this._updateLoop(t / 1000));
	}
	createScene(name) {
		const scene = new Scene();
		scene.app = this;
		this._scenes[name] = scene;
		return scene;
	}
	getScene(name) {
		return _scenes[name];
	}
	removeScene(name) {
		delete this._scenes[name].app;
		delete this._scenes[name];
	}
	setScene(name) {
		const scene = this._scenes[name];

		this._scene = scene;
		this._containers = scene._containers;
		this.physics._rigidbody = scene._containers.Rigidbody;
		this.physics._world = scene._physicsWorld;
		this.render.scene = scene._scene;
		this.render.cameras = scene.cameras;
		return scene;
	}
	get scene() {
		return this._scene;
	}
	get scenes() {
		return Object.assign({}, this._scenes);
	}
	_updateLoop(timestamp) {
		this.time.deltaTime = timestamp - this.lastTimestamp || 0;
		this.lastTimestamp = timestamp;

		this.physics._update();

		// update loop
		for (const type in this._containers) {
			const container = this._containers[type];
			if (container[0] && "update" in container[0]) {
				for (let j = 0, lenj = container.length; j < lenj; j++) {
					container[j].update();
				}
			}
		}

		this.render._update();
		this.input._reset();

		window.requestAnimationFrame((t) => this._updateLoop(t / 1000));
	}
}
