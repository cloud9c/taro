import * as THREE from "./core/three.module.js";
import { Shape, Vector3, Asset, Entity, System } from "./core/engine.js";

export function Player() {
	const obj = Asset.getObject3D("player.glb");
	const entity = new Entity({ position: new Vector3(0, 100, 0) });

	entity.addComponent("object3D", obj);
	entity.addComponent(
		"animation",
		Asset.getAnimation(obj, "player.glb", "Idle")
	);
	entity.addComponent("rigidbody", {
		mass: 60,
	});
	entity.addComponent(
		"collider",
		new Shape({
			type: "box",
			halfExtents: new Vector3(0.5, 1, 0.5),
		})
	);

	entity.addComponent("camera");

	const keyInput = System.input;
	// const curVel = entity.rigidbody.velocity;
	// const rotation = entity.transform.rotation;
	const maxSpeed = 20;
	entity.addComponent("behavior", () => {
		if (keyInput.w) {
		}
		if (keyInput.s) {
		}
		if (keyInput.a) {
		}
		if (keyInput.d) {
		}
		if (keyInput.jump) {
		}
		if (keyInput.sprint) {
		}
	});
}

export function Ball() {
	const obj = Asset.getObject3D("player.glb");
	const entity = new Entity({ position: new THREE.Vector3(5, 10, 0) });

	const geo = new THREE.SphereBufferGeometry(1, 32, 32);
	const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

	entity.addComponent("object3D", new THREE.Mesh(geo, mat));
	entity.addComponent("rigidbody", {
		mass: 10,
	});
	entity.addComponent("collider", new Shape({}));
}

export function Cube() {
	const obj = Asset.getObject3D("player.glb");
	const entity = new Entity({ position: new Vector3(5, 10, 0) });

	const geo = new THREE.BoxBufferGeometry(2, 2, 2);
	const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

	entity.addComponent("object3D", new THREE.Mesh(geo, mat));
	entity.addComponent("rigidbody", {
		mass: 10,
	});
	entity.addComponent("collider", new Shape({}));
}
