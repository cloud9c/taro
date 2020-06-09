import * as THREE from 'https://threejs.org/build/three.module.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

let scene, renderer, camera, loader;

let lastTimestamp = 0, dt;

let player;

const keyEnum = {};

class Object {
	constructor() {
		this.xVel = 0;
		this.yVel = 0;
		this.zVel = 0;
	}
}
function loadTexture(url) {
	return new Promise(resolve => {
		loader.load(url, resolve)
	})
}

class Player extends Object {
	constructor(controls) {
		super();
		this.controls = controls;

		this.friction = 0.5;
		this.speed = 1;
		this.maxWalkingSpeed = 0.1;
		this.maxSprintingSpeed = 0.2;
		// w s a d jump sprint

		loadTexture('assets/models/player.glb').then( gltf => {
			const mesh = gltf.scene;
			// mesh.scale.set(0.1, 0.1, 0.1);

			gltf.scene.traverse( node => {
				if (node.isMesh) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
			} );

			// gltf.scene.rotation.x = 90 * Math.PI/180;

			// camera setting
			camera.position.set( 2, 10, 15);
			camera.rotation.set(-20 * Math.PI/180, -0 * Math.PI/180, 0 * Math.PI/180);
			mesh.add( camera );

			var gridHelper = new THREE.GridHelper( 1000, 1000 );
			scene.add( gridHelper );

			scene.add(gltf.scene);

			this.mesh = mesh;

			requestAnimationFrame(animate);
		});
	}

	move() {
		const pos = this.mesh.position;
		const controls = this.controls;
		let xVel = this.xVel;
		let yVel = this.yVel;
		let zVel = this.zVel;

		const friction = this.friction * dt;
		const speed = this.speed * dt;
		let maxSpeed = this.maxWalkingSpeed;

		if (keyEnum[controls[5]]) {
			maxSpeed = this.maxSprintingSpeed;
		}

		if (Math.abs(zVel) < 0.01) {
			zVel = 0;
		}
		else if (zVel > 0)
			zVel -= friction;
		else if (zVel < 0)
			zVel += friction;

		if (zVel - speed > -maxSpeed && keyEnum[controls[0]]) {
			zVel -= speed;
		}

		console.log(zVel)

		if (zVel + speed < maxSpeed  && keyEnum[controls[1]]) {
			zVel += speed;
		}

		if (Math.abs(xVel) < 0.01) {
			xVel = 0;
		}
		else if (xVel > 0)
			xVel -= friction;
		else if (xVel < 0)
			xVel += friction;

		if (xVel - speed > -maxSpeed && keyEnum[controls[2]]) {
			xVel -= speed;
		}

		if (xVel + speed < maxSpeed  && keyEnum[controls[3]]) {
			xVel += speed;
		}

		const magnitude = Math.sqrt(xVel*xVel + zVel*zVel);
		if (magnitude > maxSpeed) {
			console.log(magnitude)
			xVel = xVel / magnitude * maxSpeed;
			zVel = zVel / magnitude * maxSpeed;
		}

		console.log(xVel)

		pos.x += xVel;
		pos.y += yVel;
		pos.z += zVel;
		// camera.position.x = pos.x;
		// camera.position.y = pos.y;
		// camera.position.z = pos.z;
		this.mesh.position.set(pos.x, pos.y, pos.z);

		this.xVel = xVel;
		this.yVel = yVel;
		this.zVel = zVel;
	}

	update() {
		this.move();
	}
}

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize, false );

function init() {
	//scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x0080ff );

	// loader
	loader = new GLTFLoader();

	// camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

	// renderer
	renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("c") });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
}

function create() {
	let geo, mat, mesh;

	// lighting
	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 100, 0 );
	scene.add( hemiLight );

	const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
	scene.add( hemiLightHelper );

	const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.color.setHSL( 0.1, 1, 0.95 );
	dirLight.position.set( - 1, 1.75, 1 );
	dirLight.position.multiplyScalar( 100 );
	scene.add( dirLight );

	dirLight.castShadow = true;

	dirLight.shadow.mapSize.width = 2048;
	dirLight.shadow.mapSize.height = 2048;

	var d = 50;

	dirLight.shadow.camera.left = - d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = - d;

	dirLight.shadow.camera.far = 3500;
	dirLight.shadow.bias = - 0.0001;

	const dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
	scene.add( dirLightHeper );

	//floor
	geo = new THREE.PlaneBufferGeometry( 2000, 2000 );
	mat = new THREE.MeshPhongMaterial( {color: 0x718E3E});
	mesh = new THREE.Mesh( geo, mat);
	mesh.position.y = 0;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	//player
	player = new Player(["w", "s", "a", "d", " ", "shift"]);
}

function animate (timestamp) {
	timestamp /= 1000;
	dt = timestamp - lastTimestamp;
	lastTimestamp = timestamp;

	player.update();

	renderer.render(scene, camera);

	requestAnimationFrame(animate);
};

function main() {
	init();
	create();
	// requestAnimationFrame(animate);
}

main();

document.addEventListener('keydown', function (event) {
	keyEnum[event.key.toLowerCase()] = true;
	// event.preventDefault();
});

document.addEventListener('keyup', function (event) {
	keyEnum[event.key.toLowerCase()] = false;
});

window.onblur = function (event) {
	for (var prop in keyEnum) {
	    if (Object.prototype.hasOwnProperty.call(keyEnum, prop)) {
	    	keyEnum[prop] = false
	    }
	}
};