import { Quaternion, Vector3, Matrix4 } from "../engine.js";
import { OIMO } from "../lib/oimo.js";

const vector = new Vector3();
const vector2 = new Vector3();
const quat = new Quaternion();
const matrix = new Matrix4();
const broadphaseCallback = {
	process: function (shape) {
		// console.log(shape.getLocalTransform().getPosition());
	},
};

export class Physics {
	constructor() {
		this._accumulator = 0;
		this._gravity = new Vector3(0, -9.80665, 0);

		this._triggers = [];

		this._world;
		this.rigidbodies;
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
	_update(deltaTime, fixedTimestep) {
		this._accumulator += deltaTime;

		if (this._accumulator >= fixedTimestep) {
			// sync entity and rigidbody
			let rigidbody = this._world.getRigidBodyList();
			while (rigidbody !== null) {
				rigidbody.entity.updateWorldMatrix();
				rigidbody.entity.matrixWorld.decompose(vector, quat, vector2);
				rigidbody.setOrientation(quat);
				rigidbody = rigidbody.getNext();
			}

			// trigger collision
			const triggers = this._triggers;
			for (let i = 0, len = triggers.length; i < len; i++) {
				const transform = triggers[i].getTransform();
				transform.setPosition(triggers[i].entity.position);
				transform.setOrientation(triggers[i].entity.quaternion);
				triggers[i].setLocalTransform(transform);
				this._world.aabbTest(triggers[i].getAabb(), broadphaseCallback);
			}

			// time step
			while (this._accumulator >= fixedTimestep) {
				// console.log(this._accumulator);
				this._world.step(fixedTimestep);
				for (let i = 0, len = this.rigidbodies.length; i < len; i++) {
					let rigidbody = this.rigidbodies[i];
					if (!rigidbody._ref.isSleeping()) {
						const entity = rigidbody.entity;

						const ePos = entity.position;
						const pos = rigidbody._ref.getPosition();
						ePos._x = pos.x;
						ePos._y = pos.y;
						ePos._z = pos.z;

						entity.quaternion.copy(rigidbody._ref.getOrientation());
						if (entity.parent !== entity.scene) {
							entity.position.applyMatrix4(
								matrix.copy(entity.parent.matrixWorld).invert()
							);
							entity.quaternion.premultiply(
								entity.parent.getWorldQuaternion(quat).invert()
							);
						}
					}
				}
				this._accumulator -= fixedTimestep;
			}
			// console.log("finish");
		}
	}
}
