import Asset from "./asset.js";
import Component from "./component.js";
import Entity from "./entity.js";
import System from "./system.js";
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
} from "./three.module.js";
import Shape from "./shape.js";

async function init(canvas) {
	await Asset.init();
	System.init(canvas);
}

export {
	Shape,
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
};
