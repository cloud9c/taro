export class System {
	constructor(app) {
		console.log(app.scene);
		this.input = app.input;
		this.physics = app.physics;
		this.render = app.render;
		this.time = app.time;

		this.physics.time = this.time;

		this.lastTimestamp = undefined;
	}
	updateLoop(timestamp) {
		this.time.deltaTime = timestamp - this.lastTimestamp || 0;
		this.lastTimestamp = timestamp;

		this.physics._update();

		// update loop
		for (let i = 0, len = this._containers.length; i < len; i++) {
			const container = this._containers[i];
			if ("update" in container[0]) {
				for (let j = 0, lenj = component.length; j < lenj; j++) {
					component[j].update();
				}
			}
		}

		this.render._update();
		this.input._reset();

		window.requestAnimationFrame((t) => this.updateLoop(t / 1000));
	}
}
