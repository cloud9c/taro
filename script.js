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
	return new Promise((resolve, reject) => {
		loader.load(url, data=> resolve(data), null, reject);
	});
}

function fadeToAction(name, duration ) {
	if (this.actions[ name ] === this.activeAction) {
		return
	}

	const previousAction = this.activeAction;
	this.activeAction = this.actions[ name ];

	previousAction.fadeOut( duration );

	this.activeAction
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
		this.walkingSpeed = 10;
		this.sprintingSpeed = 20;
		this.sprinting = false;

		this.sensitivity = 0.003;

		this.onGround = true;
		this.jumpVel = 8;
		this.gravity = this.jumpVel * 2;
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
				if (clip.name === "Jump") {
					action.setLoop( THREE.LoopOnce )
				}
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
				let dx = event.movementX * player.sensitivity;
				const dy = event.movementY * player.sensitivity;
				const newCameraAngle = cameraAngle + dy;
				if (dx != 0) {
					if (dx > 0.1)
						dx = 0.1;
					player.mesh.rotation.y -= dx;
				}
				if (dy != 0 && newCameraAngle < 1.1 && newCameraAngle > 0.1) {
					cameraAngle = newCameraAngle;
					camera.position.z = -Math.cos(cameraAngle) * cameraRadius;
					camera.position.y = Math.sin(cameraAngle) * cameraRadius;
					camera.rotation.x += dy;
				}
			});

			document.addEventListener('keydown', event => {
				if (event.repeat) { return }
				const key = event.key.toLowerCase();
				const controls = this.controls;
				const sprintingSpeed = this.sprintingSpeed;
				const walkingSpeed = this.walkingSpeed;
				const onGround = this.onGround;
				let speed = this.speed;

				let xVel = this.xVel;
				let yVel = this.yVel;
				let zVel = this.zVel;

				switch(key) {
					case controls[5]:
						speed = sprintingSpeed;
						if (Math.abs(xVel) > 0 || Math.abs(zVel) > 0) {
							this.sprinting = true;
							speed = sprintingSpeed;
						}
						break;
					case controls[0]:
						if (onGround) {
							zVel -= speed;
						}
						break;
					case controls[1]:
						if (onGround) {
							zVel += speed;
						}
						break;
					case controls[2]:
						if (onGround) {
							xVel -= speed;
						}
						break;
					case controls[3]:
						if (onGround) {
							xVel += speed;
						}
						break;
					case controls[4]:
						if (onGround) {
							if (this.sprinting) {
								speed = walkingSpeed;
							}
							yVel += this.jumpVel;
							fadeToAction.call(this, "Jump", 0.2);
						}
						break;
				}

				const magnitude = Math.sqrt(xVel*xVel + zVel*zVel);
				if (magnitude > speed) {
					xVel = xVel / magnitude * speed;
					zVel = zVel / magnitude * speed;
				}

				this.xVel = xVel;
				this.yVel = yVel;
				this.zVel = zVel;
				this.speed = speed;
			});

			document.addEventListener('keyup', event => {
				const key = event.key.toLowerCase();
				const controls = this.controls;
				const walkingSpeed = this.walkingSpeed;
				let speed = this.speed;

				let xVel = this.xVel;
				let yVel = this.yVel;
				let zVel = this.zVel;

				switch(key) {
					case controls[5]:
						speed = walkingSpeed;
						if (Math.abs(xVel) > 0 || Math.abs(zVel) > 0) {
							this.sprinting = false;
							speed = walkingSpeed;
						}
						break;
					case controls[0]:
					case controls[1]:
						zVel = Math.max(0, zVel - speed);
						break;
					case controls[2]:
					case controls[3]:
						xVel = Math.max(0, xVel - speed);
						break;
				}

				const magnitude = Math.sqrt(xVel*xVel + zVel*zVel);
				if (magnitude > speed) {
					xVel = xVel / magnitude * speed;
					zVel = zVel / magnitude * speed;
				}

				this.xVel = xVel;
				this.yVel = yVel;
				this.zVel = zVel;
				this.speed = speed;
			});
			requestAnimationFrame(animate);
		});
	}

	move() {
		const pos = this.mesh.position;
		const controls = this.controls;
		const newYVel = (this.yVel - this.gravity * dt) * dt;

		if (pos.y + newYVel > 0) {
			this.yVel -= this.gravity * dt;
			if (this.onGround)
				this.onGround = false;
		} else {
			this.onGround = true;
			this.yVel = 0;
			pos.y = 0;
			if (this.sprinting) {
				this.speed = this.sprintingSpeed;
				fadeToAction.call(this, "Running", 0.2);
			}
		}

		const xVel = this.xVel;
		const yVel = this.yVel;
		const zVel = this.zVel;

		console.log(Math.abs(zVel), this.speed)

		if (this.speed === 20 || Math.abs(zVel) > this.speed)
			fadeToAction.call(this, "Running", 0.2);
		else if (Math.abs(xVel) > 0 || Math.abs(zVel) > 0)
			fadeToAction.call(this, "Walking", 0.2);
		else
			fadeToAction.call(this, "Idle", 0.2);

		pos.x += (Math.sin(player.mesh.rotation.y + Math.PI) * zVel - Math.cos(player.mesh.rotation.y) * xVel) * dt;
		pos.z += (Math.cos(player.mesh.rotation.y + Math.PI) * zVel + Math.sin(player.mesh.rotation.y) * xVel) * dt;
		pos.y += yVel * dt;
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

	// console.log(1/dt)
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