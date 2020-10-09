import { Render } from "../Render.js";

class Object3D {
	init(data) {
		Object.defineProperties(this.entity.transform, {
			position: {
				value: data.position.copy(this.entity.transform.position),
			},
			rotation: {
				value: data.rotation.copy(this.entity.transform.rotation),
			},
			scale: {
				value: data.scale.copy(this.entity.transform.scale),
			},
		});
		Object.assign(this, data);
		Render.scene.add(data);
	}
}

export { Object3D };
