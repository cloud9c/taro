import * as THREE from "./src/lib/three.module.js";
import * as Engine from "./src/engine.js";

export function Player() {
	const obj = Engine.Asset.getObject3D("player.glb");
	const entity = new Engine.Entity();

	entity.Transform.setPosition(0, 100, 0);

	entity.addComponent(Engine.Object3D, obj);
	entity.addComponent(
		Engine.Animation,
		Engine.Asset.getAnimation(obj, "player.glb", "Idle")
	);
	entity.addComponent(Engine.Rigidbody, {
		mass: 60,
	});
	entity.addComponent(
		Engine.Collider,
		new Engine.Shape({
			type: "box",
			halfExtents: new Engine.Vector3(0.5, 1, 0.5),
		})
	);

	entity.addComponent(Engine.Camera);

	// const keyInput = Engine.Input;
	// const maxSpeed = 20;
	// entity.addComponent(Engine.Behavior, () => {
	// 	if (keyInput.KeyW) {
	// 		console.log("here");
	// 	}
	// 	if (keyInput.KeyS) {
	// 	}
	// 	if (keyInput.KeyA) {
	// 	}
	// 	if (keyInput.KeyD) {
	// 	}
	// 	if (keyInput.Space) {
	// 	}
	// 	if (keyInput.Shift) {
	// 	}
	// });
}

export function Ball() {
	const obj = Engine.Asset.getObject3D("player.glb");
	const entity = new Engine.Entity();

	entity.Transform.setPosition(5, 10, 0);

	const geo = new THREE.SphereBufferGeometry(1, 32, 32);
	const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

	entity.addComponent(Engine.Object3D, new THREE.Mesh(geo, mat));
	entity.addComponent(Engine.Rigidbody, {
		mass: 10,
	});
	entity.addComponent(Engine.Collider, new Engine.Shape({}));
}

export function Cube() {
	const obj = Engine.Asset.getObject3D("player.glb");
	const entity = new Engine.Entity();

	entity.Transform.setPosition(5, 10, 0);

	const geo = new THREE.BoxBufferGeometry(2, 2, 2);
	const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

	entity.addComponent(Engine.Object3D, new THREE.Mesh(geo, mat));
	entity.addComponent(Engine.Rigidbody, {
		mass: 10,
	});
	entity.addComponent(Engine.Collider, new Engine.Shape({}));
}
