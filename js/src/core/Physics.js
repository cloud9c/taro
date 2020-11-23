export class Physics {
	constructor() {
		this._accumulator = 0;
	}
	_update() {
		let rigidbody = this._world.getRigidBodyList();
		while (rigidbody !== null) {
			rigidbody.setPosition(rigidbody.entity.position);
			rigidbody.setRotationXyz(rigidbody.entity.rotation);
			rigidbody = rigidbody.getNext();
		}

		this._accumulator +=
			this.time.deltaTime > this.time.maxTimestep
				? this.time.maxTimestep
				: this.time.deltaTime;

		while (this._accumulator >= this.time.fixedTimestep) {
			this._world.step(this.time.fixedTimestep);
			for (let i = 0, len = this.rigidbodies.length; i < len; i++) {
				let rigidbody = this.rigidbodies[i];
				rigidbody._position.copy(rigidbody._ref.getPosition());
				rigidbody._rotation.setFromVector3(
					rigidbody._ref.getRotation().toEulerXyz(),
					"XYZ"
				);
			}
			this._accumulator -= this.time.fixedTimestep;
		}
	}
}
