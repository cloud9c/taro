import { System } from "./System.js";
import { Input } from "./Input.js";
import { Physics } from "./Physics.js";
import { Render } from "./Render.js";
import { Time } from "./Time.js";
import { Scene } from "./Scene.js";

export class Application {
	constructor(canvas) {
		this.canvas = document.getElementById(canvas);
		this.physics = new Physics();
		this.render = new Render(this, canvas);
		this.time = new Time();

		this._scenes = {};

		this._system = new System(this);

		this.createScene("Untitled Scene");
		this.setScene("Untitled Scene");
	}
	start() {
		window.requestAnimationFrame((t) => this._system.updateLoop(t / 1000));
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
		this._system._containers = scene._containers;
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
}
