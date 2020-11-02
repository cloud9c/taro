import { System } from "./System.js";
import { Input } from "./Input.js";
import { Physics } from "./Physics.js";
import { Render } from "./Render.js";
import { Time } from "./Time.js";
import { Scene } from "./Scene.js";

export class Application {
	constructor(canvas) {
		this.input = new Input();
		this.physics = new Physics();
		this.render = new Render(this, canvas);
		this.time = new Time();
		this.scenes = {};
		this._system = new System(this);

		this.scene = new Scene();
	}
	start() {
		window.requestAnimationFrame((t) => this._system.updateLoop(t / 1000));
	}
	get scene() {
		return this._scene;
	}
	set scene(scene) {
		this._scene = scene;
		this._system._containers = scene._containers;
		this.physics._rigidbody = scene._containers.Rigidbody;
		this.render.scene = scene;
		this.render.cameras = scene.cameras;
	}
}
