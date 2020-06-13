import * as THREE from 'https://threejs.org/build/three.module.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

let scene, renderer, camera, loader;

let cameraRadius, cameraAngle;

let lastTimestamp = 0, dt;

const keyEnum = {};

let objects = {};

let peer, connections = [], serverID, peerID;

const blacklist = ["WWBender", "Byderman", "BigNik", "Maurice", "Tomiboy"]

document.getElementById("title").textContent = "Game (No " + blacklist[Math.floor(Math.random() * blacklist.length)] + " allowed)";

function loadTexture(url) {
	return new Promise((resolve, reject) => {
		loader.load(url, data=> resolve(data), null, reject);
	});
}

function fadeToAction(name, duration, timeScale = 1) {
	if (this.actions[ name ] === this.activeAction && this.activeAction.timeScale === timeScale) {
		return
	}

	const previousAction = this.activeAction;
	this.activeAction = this.actions[ name ];

	previousAction.fadeOut( duration );

	this.activeAction
		.reset()
		.setEffectiveTimeScale( timeScale )
		.setEffectiveWeight( 1 )
		.fadeIn( duration )
		.play();
}

class Player {
	constructor(controls) {
		this.xVel = 0;
		this.yVel = 0;
		this.zVel = 0;

		this.controls = controls;

		this.walkingSpeed = 10;
		this.sprintFactor = 2;
		this.speed = this.walkingSpeed;
		this.sprinting = false;

		this.sensitivity = 0.003;

		this.onGround = true;
		this.jumpVel = 8;
		this.gravity = this.jumpVel * 2.5;
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
			document.getElementById("c").onclick = () => {
				document.body.requestPointerLock();
				if (document.body.requestFullscreen) {
					document.body.requestFullscreen();
				} else if (document.body.mozRequestFullScreen) {
					document.body.mozRequestFullScreen();
				} else if (document.body.webkitRequestFullscreen) {
					document.body.webkitRequestFullscreen();
				} else if (document.body.msRequestFullscreen) {
					document.body.msRequestFullscreen();
				}
			}

			window.onblur = event => {
				for (const property in keyEnum) {
					keyEnum[property] = false;
				}
			};

			window.addEventListener( 'resize', () => {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			});

			document.addEventListener("mousemove", event => {
				let dx = event.movementX * this.sensitivity;
				const dy = event.movementY * this.sensitivity;
				const newCameraAngle = cameraAngle + dy;
				if (dx != 0) {
					if (dx > 0.1)
						dx = 0.1;
					this.mesh.rotation.y -= dx;
				}
				if (dy != 0 && newCameraAngle < 1.1 && newCameraAngle > 0.1) {
					cameraAngle = newCameraAngle;
					camera.position.z = -Math.cos(cameraAngle) * cameraRadius;
					camera.position.y = Math.sin(cameraAngle) * cameraRadius;
					camera.rotation.x += dy;
				}
			});

			document.addEventListener('keydown', event => {
				keyEnum[event.key.toLowerCase()] = true;
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
		const newYVel = (this.yVel - this.gravity * dt) * dt;
		let speed = this.speed;

		let xVel = 0;
		let yVel = this.yVel;
		let zVel = 0;

		if (pos.y + newYVel > 0) {
			yVel -= this.gravity * dt;
		} else if (yVel < 0) {
			yVel = 0;
			pos.y = 0;
		}

		if (keyEnum[controls[0]]) {
			zVel -= 1;
		}
		if (keyEnum[controls[1]]) {
			zVel += 1;
		}
		if (keyEnum[controls[2]]) {
			xVel -= 1;
		}
		if (keyEnum[controls[3]]) {
			xVel += 1;
		}
		if (pos.y === 0) {
			if (keyEnum[controls[4]]) {
				yVel += this.jumpVel;
				fadeToAction.call(this, "Jump", 0.2);
			}
			if (keyEnum[controls[5]]) {
				speed *= this.sprintFactor;
			}
		}

		const magnitude = Math.sqrt(xVel*xVel + zVel*zVel);
		if (magnitude > 1) {
			xVel = xVel / magnitude;
			zVel = zVel / magnitude;
		}

		let dir = 1
		if (xVel > 0 || zVel > 0) {
			dir = -1;
		}

		if (pos.y === 0) { // maybe too spammy? TODO
			if (speed > this.walkingSpeed || speed > this.walkingSpeed) {
				fadeToAction.call(this, "Running", 0.2, dir);
			}
			else if (Math.abs(xVel) > 0 || Math.abs(zVel) > 0) {
				fadeToAction.call(this, "Walking", 0.2, dir);
			}
			else {
				fadeToAction.call(this, "Idle", 0.2);
			}
		}

		pos.x += (Math.sin(this.mesh.rotation.y + Math.PI) * zVel - Math.cos(this.mesh.rotation.y) * xVel) * dt * speed;
		pos.z += (Math.cos(this.mesh.rotation.y + Math.PI) * zVel + Math.sin(this.mesh.rotation.y) * xVel) * dt * speed;
		pos.y += yVel * dt;

		this.yVel = yVel;

		this.mesh.position.set(pos.x, pos.y, pos.z);
	}

	sendPacket() {
		const pos = this.mesh.position;
		send({
			id: peerID,
			type: "update",
			pos: {
				x: pos.x,
				y: pos.y,
				z: pos.z
			},
			rotationY: this.mesh.rotation.y,
			animationName: this.activeAction["_clip"]["name"]
		});
	}

	update() {
		this.move();
		this.mixer.update(dt);
		if (dt > 0.05)
			this.sendPacket();
	}
}

class OtherPlayer {
	constructor(address) {
		this.pos = {
			x: 0,
			y: 0,
			z: 0
		}

		this.rotationY = 0;
		this.address = address;

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

			objects[address] = this;
		});		
	}

	delete() {
		scene.remove(this.mesh);
	}

	update() {
		const pos = this.pos;
		this.mesh.position.set(pos.x, pos.y, pos.z);
		this.mesh.rotation.y = this.rotationY;
		this.mixer.update(dt);
		fadeToAction.call(this, this.activeAction["_clip"]["name"], 0.2);
	}
}

function init() {
	//canvas
	document.getElementById("log").textContent = "Server Code: " + serverID;
	document.getElementById("launcher").remove();
	document.getElementById("game").style.display = "block";

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
	objects["player"] = new Player(["w", "s", "a", "d", " ", "shift"]);
}

function animate (timestamp) {
	timestamp /= 1000;
	dt = timestamp - lastTimestamp;
	lastTimestamp = timestamp;

	for (const property in objects) {
		objects[property].update();
	}

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

function main() {
	init();
	create();
}

function send(data) { // TODO
	console.log("here")
	for (const c in connections) {
		connections[c].send(JSON.stringify(data));
	}
}

function addNewConnection(conn) {
	let id = conn.peer;

	conn.on("open", () => {
		new OtherPlayer(id);
		connections[id] = conn;
	});

	conn.on("data", (data) => {
		console.log(data)
		data = JSON.parse(data);
		if (objects.hasOwnProperty(id)) {
			switch (data.type) {
				case "update":
					objects[id].pos = data.pos;
					objects[id].rotationY = data.rotationY;
					break;
			}
		}
	});

	conn.on("close", () => {
		const id = conn.peer;
		objects[id].delete();
		delete objects[id];
	})
}

function serverConnect(event) {
	event.preventDefault();
	document.getElementById("joinSubmit").removeEventListener("submit", serverConnect);
	document.getElementById("hostSubmit").removeEventListener("submit", serverConnect);

	peer = new Peer();

	serverID = document.getElementById("join").value;

	peer.on('open', (id) => {
		peerID = id;
		if (event.target.id === "joinSubmit") {
			addNewConnection(peer.connect(serverID));
		} else {
			serverID = id;
		}

		main();
	});

	peer.on('connection', addNewConnection);
}

document.getElementById("joinSubmit").addEventListener("submit", serverConnect);

document.getElementById("hostSubmit").addEventListener("submit", serverConnect);