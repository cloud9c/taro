import { Quaternion, Vector3, Matrix4 } from "../engine.js";

const vector = new Vector3();
const vector2 = new Vector3();
const quat = new Quaternion();
const matrix = new Matrix4();

export class Physics {
	constructor() {
		this._accumulator = 0;
		this._gravity = new Vector3(0, -9.80665, 0);

		this._world = null;
		this.rigidbodies = null;
	}
	get gravity() {
		return this._gravity;
	}
	set gravity(gravity) {
		this._world.setGravity(gravity);
		this._gravity = gravity;
	}
	raycast(begin, end, callback) {
		// callback parameters: collider, fraction, normal, position
		this._world.rayCast(begin, end, {
			process(shape, hit) {
				callback(
					shape.collider,
					hit.fraction,
					new Vector3().copy(hit.normal),
					new Vector3().copy(hit.position)
				);
			},
		});
	}
	_update(fixedTimestep, deltaTime) {
		let rigidbody = this._world.getRigidBodyList();

		while (rigidbody !== null) {
			rigidbody.entity.matrixWorld.decompose(vector, quat, vector2);
			rigidbody.setPosition(vector);
			rigidbody.setOrientation(quat);
			rigidbody = rigidbody.getNext();
		}

		this._accumulator += deltaTime;

		while (this._accumulator >= fixedTimestep) {
			this._world.step(fixedTimestep);
			for (let i = 0, len = this.rigidbodies.length; i < len; i++) {
				let rigidbody = this.rigidbodies[i];
				if (!rigidbody._ref.isSleeping()) {
					const entity = rigidbody.entity;
					entity.position.copy(rigidbody._ref.getPosition());
					entity.position.applyMatrix4(
						matrix.getInverse(entity.parent.matrixWorld)
					);
					entity.quaternion.copy(rigidbody._ref.getOrientation());
					entity.quaternion.premultiply(
						entity.parent.getWorldQuaternion(quat).inverse()
					);
				}
			}
			this._accumulator -= fixedTimestep;
		}
	}
}
