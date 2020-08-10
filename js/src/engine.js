import Asset from "./Asset.js";
import Component from "./Component.js";
import Entity from "./Entity.js";
import System from "./System.js";
import Input from "./Input.js";
import {
	Color,
	Euler,
	Matrix3,
	Matrix4,
	Plane,
	Quaternion,
	Ray,
	Vector2,
	Vector3,
	Vector4,
} from "./lib/three.module.js";

// components
import Animation from "./components/Animation.js";
import Camera from "./components/Camera.js";
import Collider from "./components/Collider.js";
import Object3D from "./components/Object3D.js";
import Rigidbody from "./components/Rigidbody.js";
import Shape from "./Shape.js";
import Transform from "./components/Transform.js";

async function init(canvas) {
	await Asset.init();
	System.init(canvas);
}

export {
	Color,
	Euler,
	Matrix3,
	Matrix4,
	Plane,
	Quaternion,
	Ray,
	Vector2,
	Vector3,
	Vector4,
	init,
	Asset,
	Component,
	Entity,
	System,
	Animation,
	Camera,
	Collider,
	Input,
	Object3D,
	Rigidbody,
	Shape,
	Transform,
};
