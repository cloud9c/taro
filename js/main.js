import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import * as ENGINE from "./src/engine.js";
import * as THREE from "./src/lib/three.module.js";

ENGINE.createComponent(
	"CameraController",
	class {
		init() {
			this.direction = new ENGINE.Vector3();
			this.input = this.entity.scene.app.input;
			this.entity.rotation.order = "YXZ";

			window.addEventListener("mousedown", () => {
				this.entity.scene.app.canvas.requestPointerLock();
			});
		}
		update() {
			if (this.input.getKey("KeyW") || this.input.getKey("ArrowUp")) {
				this.entity.translateZ(-0.1);
			}
			if (this.input.getKey("KeyS") || this.input.getKey("ArrowDown")) {
				this.entity.translateZ(0.1);
			}
			if (this.input.getKey("KeyA") || this.input.getKey("ArrowLeft")) {
				this.entity.translateX(-0.1);
			}
			if (this.input.getKey("KeyD") || this.input.getKey("ArrowRight")) {
				this.entity.translateX(0.1);
			}
			if (this.input.getKey("Space")) {
				this.entity.translateY(0.1);
			}
			if (this.input.getKey("ShiftLeft")) {
				this.entity.translateY(-0.1);
			}
			this.entity.rotation.x -= this.input.mouseDelta.y * 0.002;
			this.entity.rotation.y -= this.input.mouseDelta.x * 0.002;
		}
	}
);

let entity, geo, mat, mesh;

const loader = new GLTFLoader();
const app = new ENGINE.Application("c");
const scene = app.scene;

console.log(app.scene._containers);

// lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);

entity = new ENGINE.Entity();
entity.addComponent("Mesh", hemiLight);
entity.position.set(0, 100, 0);

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

entity = new ENGINE.Entity();
entity.addComponent("Mesh", dirLight);
entity.position.set(-100, 175, 100);

// camera
entity = new ENGINE.Entity("camera");
entity.addComponent("PerspectiveCamera");
entity.addComponent("CameraController");
entity.position.set(0, 5, 10);

// floor
geo = new THREE.PlaneBufferGeometry(200, 200);
mat = new THREE.MeshPhongMaterial({
	color: 0x718e3e,
});
mesh = new THREE.Mesh(geo, mat);
mesh.receiveShadow = true;

entity = new ENGINE.Entity("floor");
entity.addComponent("Mesh", mesh);
entity.addComponent("BoxCollider", {
	halfExtents: new ENGINE.Vector3(100, 1, 100),
});
entity.rotation.set(-Math.PI / 2, 0, 0);

new ENGINE.Entity().addComponent(
	"Mesh",
	new THREE.GridHelper(1000, 1000, 0x0000ff, 0x808080)
);

entity = new ENGINE.Entity("player");
entity.addComponent("Rigidbody", {
	mass: 60,
});
entity.addComponent("BoxCollider", {
	halfExtents: new ENGINE.Vector3(0.5, 1, 0.5),
});
entity.position.set(0, 5, 0);

loader.load("assets/models/player.glb", (gltf) => {
	entity.addComponent("Mesh", gltf.scene);
});

app.start();
