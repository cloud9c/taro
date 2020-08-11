import { Object3D as O3D } from "../lib/three.module.js";
import { System } from "../System.js";

class Object3D {
	init(data) {
		Object.assign(this, data);
		System.scene.add(data);
	}
}

export { Object3D };
