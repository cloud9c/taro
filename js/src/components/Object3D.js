import { Render } from "../Render.js";

class Object3D {
	init(data) {
		Object.defineProperties(this.transform, {
			position: {
				value: data.position.copy(this.transform.position),
			},
			rotation: {
				value: data.rotation.copy(this.transform.rotation),
			},
			scale: {
				value: data.scale.copy(this.transform.scale),
			},
		});
		Object.assign(this, data);
		Render.scene.add(data);
	}
}

export { Object3D };
