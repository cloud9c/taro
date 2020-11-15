import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";

let geo, mat, mesh;

const loader = new GLTFLoader();
const app = new ENGINE.Application("c");
const scene = app.scene;

// lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
new ENGINE.Entity().addComponent("Mesh", hemiLight).position.set(0, 100, 0);

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

new ENGINE.Entity().addComponent("Mesh", dirLight).position.set(-100, 175, 100);

// camera
new ENGINE.Entity("camera")
	.addComponent("PerspectiveCamera")
	.position.set(0, 5, 10);

// floor
geo = new THREE.PlaneBufferGeometry(200, 200);
mat = new THREE.MeshPhongMaterial({
	color: 0x718e3e,
});
mesh = new THREE.Mesh(geo, mat);
mesh.receiveShadow = true;

new ENGINE.Entity("floor")
	.addComponent("Mesh", mesh)
	.addComponent("BoxCollider", {
		halfExtents: new ENGINE.Vector3(100, 1, 100),
	})
	.rotation.set(-Math.PI / 2, 0, 0);

new ENGINE.Entity().addComponent(
	"Mesh",
	new THREE.GridHelper(1000, 1000, 0x0000ff, 0x808080)
);

const entity = new ENGINE.Entity("player")
	.addComponent("Rigidbody", {
		mass: 60,
	})
	.addComponent("BoxCollider", {
		halfExtents: new ENGINE.Vector3(0.5, 1, 0.5),
	});

entity.position.set(0, 5, 0);

loader.load("assets/models/player.glb", (gltf) => {
	entity.addComponent("Mesh", gltf.scene);
});

app.start();
