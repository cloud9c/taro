import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import * as ENGINE from "./src/engine.js";
import * as THREE from "./src/lib/three.js";

ENGINE.createComponent(
	"CameraController",
	class {
		start() {
			this.direction = new ENGINE.Vector3();
			this.input = this.entity.scene.app.input;
			this.entity.rotation.order = "YXZ";

			window.addEventListener("mousedown", () => {
				this.entity.scene.app.canvas.requestPointerLock();
			});
		}
		update() {
			const ball = this.entity.scene.find("ball");

			if (this.input.getKeyDown("ArrowUp")) {
				ball.getComponent("Rigidbody").applyForceToCenter(
					new ENGINE.Vector3(0, 0, -200)
				);
			}
			if (this.input.getKeyDown("ArrowDown")) {
				ball.getComponent("Rigidbody").applyForceToCenter(
					new ENGINE.Vector3(0, 0, 200)
				);
			}
			if (this.input.getKeyDown("ArrowLeft")) {
				ball.getComponent("Rigidbody").applyForceToCenter(
					new ENGINE.Vector3(-200, 0, 0)
				);
			}
			if (this.input.getKeyDown("ArrowRight")) {
				ball.getComponent("Rigidbody").applyForceToCenter(
					new ENGINE.Vector3(200, 0, 0)
				);
			}

			if (this.input.getKey("KeyW")) {
				this.entity.translateZ(-0.1);
			}
			if (this.input.getKey("KeyS")) {
				this.entity.translateZ(0.1);
			}
			if (this.input.getKey("KeyA")) {
				this.entity.translateX(-0.1);
			}
			if (this.input.getKey("KeyD")) {
				this.entity.translateX(0.1);
			}
			if (this.input.getKey("Space")) {
				this.entity.translateY(0.1);
			}
			if (this.input.getKey("ShiftLeft")) {
				this.entity.translateY(-0.1);
			}
			this.entity.rotation.x -= this.input.mouseDelta.y * 0.001;
			this.entity.rotation.y -= this.input.mouseDelta.x * 0.001;
		}
	}
);

let entity, geo, mat, mesh;

const loader = new GLTFLoader();
const app = new ENGINE.Application("c");

app.scene.background = new ENGINE.Color("skyblue");
console.log(app.scene);

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
entity.addComponent("Collider", {
	type: "box",
	halfExtents: new ENGINE.Vector3(100, 100, 0.1),
});
entity.rotation.set(-Math.PI / 2, 0, 0);

new ENGINE.Entity().addComponent(
	"Mesh",
	new THREE.GridHelper(1000, 1000, 0x0000ff, 0x808080)
);

// ball
geo = new THREE.SphereGeometry(1, 32, 32);
mat = new THREE.MeshPhongMaterial({ color: 0xffff00 });
mesh = new THREE.Mesh(geo, mat);
entity = new ENGINE.Entity("ball");
entity.addComponent("Mesh", mesh);
entity.position.set(0, 5, 2);
entity.addComponent("Rigidbody");
entity.addComponent("Collider", {
	type: "sphere",
	radius: 1,
});

// blocks
const position = new ENGINE.Vector3(-10, 1, -5);
for (let k = 0; k < 4; k++) {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 20; j++) {
			entity = new ENGINE.Entity();
			mesh = new THREE.Mesh(
				new THREE.BoxBufferGeometry(1, 1, 1),
				new THREE.MeshPhongMaterial({ color: 0x2194ce })
			);
			entity.addComponent("Mesh", mesh);
			entity.position.copy(position);
			entity.addComponent("Rigidbody", { mass: 0.1 });
			entity.addComponent("Collider", {
				type: "box",
				halfExtents: new ENGINE.Vector3(0.5, 0.5, 0.5),
			});
			position.x += 1;
		}
		position.y += 1;
		position.x = -10;
	}
	position.y = 1;
	position.z += 1;
}

app.start();
