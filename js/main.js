import * as THREE from "./src/lib/three.module.js";
import * as Engine from "./src/engine.js";
import * as Prefab from "./prefab.js";

init();

async function init() {
	let geo, mat, mesh;

	await Engine.init("c");

	// lighting
	const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
	hemiLight.color.setHSL(0.6, 1, 0.6);
	hemiLight.groundColor.setHSL(0.095, 1, 0.75);
	new Engine.Entity()
		.addComponent("Object3D", hemiLight)
		.transform.position.set(0, 100, 0);

	const dirLight = new THREE.DirectionalLight(0xffffff, 1);
	dirLight.color.setHSL(0.1, 1, 0.95);

	dirLight.castShadow = true;

	dirLight.shadow.mapSize.width = 2048;
	dirLight.shadow.mapSize.height = 2048;

	const d = 50;

	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;

	dirLight.shadow.camera.far = 3500;
	dirLight.shadow.bias = -0.0001;

	new Engine.Entity()
		.addComponent("Object3D", dirLight)
		.transform.position.set(-100, 175, 100);

	// camera
	new Engine.Entity("camera")
		.addComponent("PerspectiveCamera")
		.transform.position.set(0, 10, 40);

	// floor
	geo = new THREE.PlaneBufferGeometry(200, 200);
	mat = new THREE.MeshPhongMaterial({
		color: 0x718e3e,
	});
	mesh = new THREE.Mesh(geo, mat);
	mesh.receiveShadow = true;

	new Engine.Entity("floor")
		.addComponent("Object3D", mesh)
		.addComponent("BoxCollider", {
			halfExtents: new Engine.Vector3(100, 1, 100),
		})
		.transform.rotation.set(-Math.PI / 2, 0, 0);

	new Engine.Entity().addComponent(
		"Object3D",
		new THREE.GridHelper(1000, 1000, 0x0000ff, 0x808080)
	);

	var geometry = new THREE.BoxGeometry();
	var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	var cube = new THREE.Mesh(geometry, material);
	cube.position.set(0, 10, 0);
	Engine.Render.scene.add(cube);

	// Prefab.Cube();
	Prefab.Player();
	// Prefab.Ball();

	window.requestAnimationFrame((t) => Engine.System.updateLoop(t / 1000));
}
