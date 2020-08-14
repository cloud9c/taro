import { Asset } from "./Asset.js";
import { System } from "./System.js";

export { Asset } from "./Asset.js";
export { Component } from "./Component.js";
export { Entity } from "./Entity.js";
export { System } from "./System.js";
export { Input } from "./Input.js";

// math
export { Color } from "./math/Color.js";
export { Euler } from "./math/Euler.js";
export { Matrix3 } from "./math/Matrix3.js";
export { Matrix4 } from "./math/Matrix4.js";
export { Plane } from "./math/Plane.js";
export { Quaternion } from "./math/Quaternion.js";
export { Ray } from "./math/Ray.js";
export { Vector2 } from "./math/Vector2.js";
export { Vector3 } from "./math/Vector3.js";
export { Vector4 } from "./math/Vector4.js";

// component
export { Shape } from "./Shape.js";

export async function init(canvas) {
	await Asset.init();
	System.init(canvas);
}
