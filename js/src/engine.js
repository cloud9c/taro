// global properties
export { Input } from "./Input.js";
export { Physics } from "./Physics.js";
export { Time } from "./Time.js";
export { Render } from "./Render.js";

// core
export { Component } from "./core/Component.js";
export { Entity } from "./core/Entity.js";
export { System } from "./core/System.js";

// lib
export * as THREE from "./lib/three.module.js";

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

// imports
import { System } from "./core/System.js";
import { Render } from "./Render.js";

// core components
import "./components/Animation.js";
import "./components/Object3D.js";
import "./components/physics/Rigidbody.js";
import "./components/Transform.js";

import "./components/camera/OrthographicCamera.js";
import "./components/camera/PerspectiveCamera.js";

import "./components/physics/BoxCollider.js";
import "./components/physics/CapsuleCollider.js";
import "./components/physics/ConeCollider.js";
import "./components/physics/CylinderCollider.js";
import "./components/physics/SphereCollider.js";

export async function init(canvas) {
	Render.init(canvas);
	System.init();
}
