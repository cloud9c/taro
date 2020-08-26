import { Object3D as O3D } from "../lib/three.module.js";
import { Render } from "../Render.js";

class Object3D {
	init(data) {
		Object.defineProperties(data, {
			position: {
				value: this.entity.transform.position,
			},
			rotation: {
				value: this.entity.transform.rotation,
			},
			scale: {
				value: this.entity.transform.scale,
			},
		});
		Object.assign(this, data);
		Render.scene.add(data);
	}
}

export { Object3D };
