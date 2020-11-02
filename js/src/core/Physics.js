import { OIMO } from "../lib/oimoPhysics.js";
export class Physics {
	constructor() {
		this._accumulator = 0;
		this._world = new OIMO.World(2);
	}
	_update() {
		this._accumulator +=
			this.time.deltaTime > this.time.maxTimestep
				? this.time.maxTimestep
				: this.time.deltaTime;
		while (this._accumulator >= this.time.fixedTimestep) {
			for (let i = 0, len = this._rigidbody.length; i < len; i++) {
				const rigidbody = this._rigidbody[i];
				rigidbody.transform.position.copy(rigidbody._ref.getPosition());
				rigidbody.transform.rotation.setFromVector3(
					rigidbody._ref.getRotation().toEulerXyz()
				);
			}
			this._world.step(this.time.fixedTimestep);
			this._accumulator -= this.time.fixedTimestep;
		}
	}
}
