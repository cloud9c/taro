import { Euler } from "../math/Euler.js";
import { Vector3 } from "../math/Vector3.js";

class Transform {
	init(data) {
		Object.defineProperties(this, {
			position: {
				value: "position" in data ? data.position : new Vector3(),
				configurable: true,
			},
			rotation: {
				value: "rotation" in data ? data.rotation : new Euler(),
				configurable: true,
			},
			scale: {
				value: "scale" in data ? data.scale : new Vector3(1, 1, 1),
				configurable: true,
			},
		});
	}
}

export { Transform };
