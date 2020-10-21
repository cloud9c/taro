import * as THREE from "./src/lib/three.module.js";
import * as Engine from "./src/engine.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export function Player() {
	const entity = new Engine.Entity("player");
	entity.transform.position.set(0, 5, 0);

	loader.load("assets/models/player.glb", (gltf) => {
		entity.addComponent("Object3D", gltf.scene);
	});

	// entity.addComponent(
	// 	"Animation",
	// 	Engine.Asset.getAnimation(obj, "player.glb", "Idle")
	// );
	entity.addComponent("Rigidbody", {
		mass: 60,
	});
	entity.addComponent("BoxCollider", {
		halfExtents: new Engine.Vector3(0.5, 1, 0.5),
	});
}

export function Ball() {
	const entity = new Engine.Entity();

	entity.transform.position.set(5, 10, 0);

	const geo = new THREE.SphereBufferGeometry(1, 32, 32);
	const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

	entity.addComponent("Object3D", new THREE.Mesh(geo, mat));
	entity.addComponent("Rigidbody", {
		mass: 10,
	});
	entity.addComponent("BoxCollider");
}

export function Cube() {
	const entity = new Engine.Entity();

	entity.transform.position.set(5, 10, 0);

	const geo = new THREE.BoxBufferGeometry(2, 2, 2);
	const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

	entity.addComponent("Object3D", new THREE.Mesh(geo, mat));
	entity.addComponent("Rigidbody", {
		mass: 10,
	});
	entity.addComponent("BoxCollider");
}
