import { Render } from "../Render.js";
import { Component } from "../core/Component.js";

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

Component.createComponent("Object3D", Object3D);
