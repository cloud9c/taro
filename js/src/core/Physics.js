export class Physics {
	constructor() {
		this._accumulator = 0;
	}
	_update() {
		this._accumulator +=
			this.time.deltaTime > this.time.maxTimestep
				? this.time.maxTimestep
				: this.time.deltaTime;
		while (this._accumulator >= this.time.fixedTimestep) {
			for (let i = 0, len = this._rigidbody.length; i < len; i++) {
				const rigidbody = this._rigidbody[i];
				rigidbody.entity.position.copy(rigidbody._ref.getPosition());
				rigidbody.entity.rotation.setFromVector3(
					rigidbody._ref.getRotation().toEulerXyz()
				);
			}
			this._world.step(this.time.fixedTimestep);
			this._accumulator -= this.time.fixedTimestep;
		}
	}
}
