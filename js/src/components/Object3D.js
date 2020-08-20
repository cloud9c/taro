import { Object3D as O3D } from "../lib/three.module.js";
import { Render } from "../Render.js";

class Object3D {
	init(data) {
		this._ref = data;
		Render.scene.add(data);
	}
}

export { Object3D };
