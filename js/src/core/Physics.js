import { Quaternion, Vector3 } from "../engine.js";

const vector = new Vector3();
const quat = new Quaternion();
const quat2 = new Quaternion();
export class Physics {
	constructor() {
		this._accumulator = 0;
	}
	_update() {
		let rigidbody = this._world.getRigidBodyList();
		const fixedTimestep = this.time.fixedTimestep;

		while (rigidbody !== null) {
			const worldPos = rigidbody.entity.getWorldPosition(vector);
			if (!worldPos.equals(rigidbody.getPosition()))
				rigidbody.setPosition(worldPos);

			const worldQuat = rigidbody.entity.getWorldQuaternion(quat);
			if (!worldQuat.equals(quat2.copy(rigidbody.getOrientation())))
				rigidbody.setOrientation(worldQuat);

			let collider = rigidbody.getShapeList();
			while (collider !== undefined) {
				const worldScale = rigidbody.entity.getWorldScale(vector);
				if (!worldScale.equals(collider._scale)) {
					console.log(worldScale, collider._scale);
				}

				collider = collider.getNext();
			}

			rigidbody = rigidbody.getNext();
		}

		this._accumulator += this.time.deltaTime;

		while (this._accumulator >= fixedTimestep) {
			this._world.step(fixedTimestep);
			for (let i = 0, len = this.rigidbodies.length; i < len; i++) {
				let rigidbody = this.rigidbodies[i];
				if (!rigidbody._ref.isSleeping()) {
					const entity = rigidbody.entity;
					entity.position.copy(rigidbody._ref.getPosition());
					const totalQuat = quat.copy(
						rigidbody._ref.getOrientation()
					);
					rigidbody.entity.quaternion.copy(
						totalQuat.premultiply(
							entity.parent.getWorldQuaternion(quat2).inverse()
						)
					);
				}
			}
			this._accumulator -= fixedTimestep;
		}
	}
}
