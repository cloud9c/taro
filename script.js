import * as THREE from 'https://threejs.org/build/three.module.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

let scene, renderer, camera, loader;

let cameraRadius, cameraAngle;

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

function fadeToAction( actions, activeAction, name, duration ) {
	const previousAction = activeAction;
	activeAction = actions[ name ];

	if ( previousAction !== activeAction ) {

		previousAction.fadeOut( duration );

	}

	activeAction
		.reset()
		.setEffectiveTimeScale( 1 )
		.setEffectiveWeight( 1 )
		.fadeIn( duration )
		.play();
}

class Player extends Object {
	constructor(controls) {
		super();
		this.controls = controls;

		this.speed = 10;
		this.sprintSpeed = 20;
		this.sensitivity = 0.01;
		// w s a d jump sprint

		loadTexture('assets/models/player.glb').then( gltf => {
			const mesh = gltf.scene;
			const animations = gltf.animations;
			let actions = [], activeAction;

			mesh.traverse( node => {
				if (node.isMesh) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
			} );

			mesh.rotation.y = 180 * Math.PI/180

			// gltf.scene.rotation.x = 90 * Math.PI/180;

			// camera setting
			camera.position.set( -2, 10, -15);
			camera.rotation.set(-160 * Math.PI/180, 0, 180 * Math.PI/180);
			cameraRadius = Math.sqrt(camera.position.z*camera.position.z + camera.position.y*camera.position.y);
			cameraAngle = Math.acos(-camera.position.z/cameraRadius);
			mesh.add( camera );

			const gridHelper = new THREE.GridHelper( 1000, 1000, 0x0000ff, 0x808080  );
			scene.add( gridHelper );

			// Animation
			const mixer = new THREE.AnimationMixer( mesh );

			for (let i = 0; i < animations.length; i ++) {
				const clip = animations[i];
				const action = mixer.clipAction( clip );
				actions[ clip.name ] = action;
			}

			activeAction = actions[ 'Idle' ];
			activeAction.play();

			scene.add(mesh);

			// set to this
			this.mixer = mixer;
			this.actions = actions;
			this.activeAction = activeAction;
			this.mesh = mesh;

			// takeover
			document.addEventListener("mousemove", event => {
				const dx = event.movementX;
				const dy = event.movementY;
				if (dx != 0) {
					player.mesh.rotation.y -= dx * player.sensitivity;
				}
				if (dy != 0) {
					cameraAngle += dy * player.sensitivity;
					camera.position.z = -Math.cos(cameraAngle) * cameraRadius;
					camera.position.y = Math.sin(cameraAngle) * cameraRadius;
					camera.rotation.x += dy * player.sensitivity;
				}
			});

			document.addEventListener('keydown', event => {
				const key = event.key.toLowerCase();
				keyEnum[key] = true;
			});

			document.addEventListener('keyup', event => {
				keyEnum[event.key.toLowerCase()] = false;
			});
			requestAnimationFrame(animate);
		});
	}

	move() {
		const pos = this.mesh.position;
		const controls = this.controls;
		let xVel = 0;
		let yVel = 0;
		let zVel = 0;

		let speed = this.speed * dt;

		if (keyEnum[controls[5]]) {
			speed = this.sprintSpeed * dt;
		}

		if (keyEnum[controls[0]]) {
			zVel -= speed;
		}

		if (keyEnum[controls[1]]) {
			zVel += speed;
		}

		if (keyEnum[controls[2]]) {
			xVel -= speed;
		}

		if (keyEnum[controls[3]]) {
			xVel += speed;
		}

		const magnitude = Math.sqrt(xVel*xVel + zVel*zVel);
		if (magnitude > speed) {
			xVel = xVel / magnitude * speed;
			zVel = zVel / magnitude * speed;
		}

		pos.x += Math.sin(player.mesh.rotation.y + Math.PI) * zVel - Math.cos(player.mesh.rotation.y) * xVel;
		pos.z += Math.cos(player.mesh.rotation.y + Math.PI) * zVel + Math.sin(player.mesh.rotation.y) * xVel;
		this.mesh.position.set(pos.x, pos.y, pos.z);
	}

	update() {
		this.move();
		this.mixer.update(dt);
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
	scene.fog = new THREE.Fog(new THREE.Color( 0x0080ff ), 150, 200);


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

	console.log(1/dt)
	requestAnimationFrame(animate);
};

function main() {
	init();
	create();
	// requestAnimationFrame(animate);
}

main();

window.onblur = event => {
	for (var prop in keyEnum) {
	    if (Object.prototype.hasOwnProperty.call(keyEnum, prop)) {
	    	keyEnum[prop] = false
	    }
	}
};

document.body.onclick = function() {
	document.body.requestPointerLock();
	document.body.requestFullscreen();
}