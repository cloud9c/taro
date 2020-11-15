export class Physics {
	constructor() {
		this._accumulator = 0;
	}
	_update() {
		for (let i = 0, len = this._rigidbody.length; i < len; i++) {
			const rigidbody = this._rigidbody[i];
			rigidbody._ref.setPosition(rigidbody.entity.position);
			rigidbody._ref.setRotationXyz(rigidbody.entity.rotation);
		}
		this._accumulator +=
			this.time.deltaTime > this.time.maxTimestep
				? this.time.maxTimestep
				: this.time.deltaTime;
		while (this._accumulator >= this.time.fixedTimestep) {
			this._world.step(this.time.fixedTimestep);
			for (let i = 0, len = this._rigidbody.length; i < len; i++) {
				const rigidbody = this._rigidbody[i];
				rigidbody.entity.position.copy(rigidbody._ref.getPosition());
				rigidbody.entity.rotation.setFromVector3(
					rigidbody._ref.getRotation().toEulerXyz()
				);
			}
			this._accumulator -= this.time.fixedTimestep;
		}
	}
}
