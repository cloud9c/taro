import * as THREE from 'https://threejs.org/build/three.module.js';
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

let scene, renderer, camera, canvas;

let cameraRadius, cameraAngle;

let lastTimestamp = 0, dt;

const keyEnum = {}, objects = {};

let peer, connections = [], serverID, peerID, hosting, nickname;

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

		const gltf = assets.copy('player.glb');
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
			if (clip.name === 'Jump') {
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

		// event listeners
		canvas.addEventListener('click', () => {
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
		});

		window.addEventListener('blur', event => {
			for (const property in keyEnum) {
				keyEnum[property] = false;
			}
		});

		window.addEventListener( 'resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		});

		document.addEventListener('mousemove', event => {
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

		document.addEventListener("wheel", event => {
			if (event.wheelDeltaY < 0) {
				const newZoom = camera.zoom - 0.05;
				if (newZoom > 0.65)
					camera.zoom = newZoom;
				else
					camera.zoom = 0.65;
			}
			else {
				const newZoom = camera.zoom + 0.05;
				if (newZoom < 1.65)
					camera.zoom = newZoom;
				else
					camera.zoom = 1.65;
			}
			camera.updateProjectionMatrix();
		});

		requestAnimationFrame(animate);
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
				fadeToAction.call(this, 'Jump', 0.2, 0.);
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
				fadeToAction.call(this, 'Running', 0.2, dir);
			}
			else if (Math.abs(xVel) > 0 || Math.abs(zVel) > 0) {
				fadeToAction.call(this, 'Walking', 0.2, dir);
			}
			else {
				fadeToAction.call(this, 'Idle', 0.2);
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
		const data = {
			id: peerID,
			type: 'update',
			pos: {
				x: pos.x,
				y: pos.y,
				z: pos.z
			},
			rotationY: this.mesh.rotation.y,
			animationName: this.activeAction['_clip']['name'],
			animationDir: this.activeAction.timeScale
		}

		for (const c of Object.values(connections)) {
			c[0].send(data);
		}
	}

	update() {
		this.move();
		this.mixer.update(dt);
		this.sendPacket();
	}
}

class OtherPlayer {
	constructor(id, metadata) {
		this.pos = new THREE.Vector3(0, 0, 0);
		this.rotationY = 0;
		this.id = id;

		if (hosting) {
			connections[id][0].send({type: 'playerList', playerList: Object.keys(connections)});
		}

		// gltf models
		const gltf = assets.copy('player.glb');
		const mesh = gltf.scene;
		const animations = gltf.animations;
		let actions = [], activeAction;
		const animationName = 'Idle';

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
			if (clip.name === 'Jump') {
				action.setLoop( THREE.LoopOnce )
			}
			actions[ clip.name ] = action;
		}

		activeAction = actions[ animationName ];
		activeAction.play();

		// overhead
		let overhead = makeTextSprite(metadata['nickname'], { fontsize: 24, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8} } );
		overhead.position.setY(5.5);
		mesh.add( overhead );

		// set to this
		this.overhead = overhead;
		this.mixer = mixer;
		this.actions = actions;
		this.activeAction = activeAction;
		this.animationName = animationName;
		this.animationDir = 1;
		this.mesh = mesh;

		objects[id] = this;

		scene.add(mesh);
	}

	delete() {
		scene.remove(this.mesh);
	}

	update() {
		const pos = this.pos;
		this.mesh.position.set(pos.x, pos.y, pos.z);
		this.mesh.rotation.y = this.rotationY;
		this.mixer.update(dt);
		fadeToAction.call(this, this.animationName, 0.2, this.animationDir);
	}
}

const assets = {
	copy(asset) {
		const gltf = this[asset]
		const clone = {
			animations: gltf.animations,
			scene: gltf.scene.clone()
		};

		const skinnedMeshes = {};

		gltf.scene.traverse(node => {
			if (node.isSkinnedMesh) {
				skinnedMeshes[node.name] = node;
			}
		});

		const cloneBones = {};
		const cloneSkinnedMeshes = {};

		clone.scene.traverse(node => {
			if (node.isBone) {
				cloneBones[node.name] = node;
			}

			if (node.isSkinnedMesh) {
				cloneSkinnedMeshes[node.name] = node;
			}
		});

		for (let name in skinnedMeshes) {
			const skinnedMesh = skinnedMeshes[name];
			const skeleton = skinnedMesh.skeleton;
			const cloneSkinnedMesh = cloneSkinnedMeshes[name];

			const orderedCloneBones = [];

			for (let i = 0; i < skeleton.bones.length; ++i) {
				const cloneBone = cloneBones[skeleton.bones[i].name];
				orderedCloneBones.push(cloneBone);
			}

			cloneSkinnedMesh.bind(
				new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
				cloneSkinnedMesh.matrixWorld);
		}

		return clone;
	}
};

function makeTextSprite( message, parameters ) {
	if ( parameters === undefined ) parameters = {};
	var fontface = parameters.hasOwnProperty('fontface') ? parameters['fontface'] : 'Arial';
	var fontsize = parameters.hasOwnProperty('fontsize') ? parameters['fontsize'] : 18;
	var borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters['borderThickness'] : 4;
	var borderColor = parameters.hasOwnProperty('borderColor') ?parameters['borderColor'] : { r:0, g:0, b:0, a:1.0 };
	var backgroundColor = parameters.hasOwnProperty('backgroundColor') ?parameters['backgroundColor'] : { r:255, g:255, b:255, a:1.0 };
	var textColor = parameters.hasOwnProperty('textColor') ?parameters['textColor'] : { r:0, g:0, b:0, a:1.0 };

	var tempCanvas = document.createElement('canvas');
	var context = tempCanvas.getContext('2d');
	context.font = 'Bold ' + fontsize + 'px ' + fontface;
	var metrics = context.measureText( message );
	var textWidth = metrics.width;

	context.fillStyle   = 'rgba(' + backgroundColor.r + ',' + backgroundColor.g + ',' + backgroundColor.b + ',' + backgroundColor.a + ')';
	context.strokeStyle = 'rgba(' + borderColor.r + ',' + borderColor.g + ',' + borderColor.b + ',' + borderColor.a + ')';

	var x = borderThickness/2 + (textWidth + borderThickness) * 1.1;
	var y = borderThickness/2 + fontsize * 1.4 + borderThickness;
	context.translate((tempCanvas.width - x)/2, (tempCanvas.height - y)/2);

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

	context.fillStyle = 'rgba('+textColor.r+', '+textColor.g+', '+textColor.b+', 1.0)';
	context.fillText( message, borderThickness, fontsize + borderThickness);

	var texture = new THREE.Texture(tempCanvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture, transparent: true} );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
	return sprite;  
}

function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function init() {
	let geo, mat, mesh;

	//canvas
	canvas = document.getElementById('c');
	document.getElementById('log').textContent = 'Server Code: ' + serverID;
	document.getElementById('launcher').remove();
	document.getElementById('loading').remove();
	document.getElementById('game').style.display = 'block';

	//scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x0080ff );
	scene.fog = new THREE.Fog(new THREE.Color( 0x0080ff ), 150, 200);

	// camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

	// renderer
	renderer = new THREE.WebGLRenderer({ canvas: canvas });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;

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
	objects['player'] = new Player(['w', 's', 'a', 'd', ' ', 'shift']);
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

function animate(timestamp) {
	timestamp /= 1000;
	dt = timestamp - lastTimestamp;
	lastTimestamp = timestamp;

	for (const property in objects) {
		objects[property].update();
	}

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

function addNewConnection(conn) {
	const id = conn.peer;

	if (id === peerID)
		return;

	conn.on('open', () => {
		if (id === serverID) {
			init();
		}
		connections[id] = [conn];
		new OtherPlayer(id, conn.metadata);
	});

	conn.on('data', (data) => {
		if (objects.hasOwnProperty(data.id)) {
			switch (data.type) {
				case 'update':
					const pos = data.pos;
					objects[id].pos.set(pos.x, pos.y, pos.z);
					objects[id].rotationY = data.rotationY;
					objects[id].animationName = data.animationName;
					objects[id].animationDir = data.animationDir;
					break;
			}
		} else if (data.type === 'playerList') {
			const playerList = data.playerList;
			for (let i = 0; i < playerList.length; i++) {
				addNewConnection(peer.connect(playerList[i], {metadata: nickname}));
			}
		}
	});

	conn.on('close', () => {
		const id = conn.peer;
		objects[id].delete();
		delete objects[id];
	})
}

function loadGame(event) {
	event.preventDefault();
	document.getElementById('joinSubmit').removeEventListener('submit', loadGame);
	document.getElementById('hostSubmit').removeEventListener('submit', loadGame);
	document.getElementById('launcher').style.display = 'none';
	document.getElementById('loading').style.display = 'flex';

	const manager = new THREE.LoadingManager();
	const modelLoader = new GLTFLoader(manager);
	const models = ['player.glb'];

	for (let i = 0; i < models.length; i++) {
		modelLoader.load('assets/models/' + models[i], gltf => {
			assets[models[i]] = gltf;
		});
	}

	manager.onProgress = (url, itemsLoaded, itemsTotal) => {
		document.getElementById('loadingInfo').textContent = 'Loading: ' + url;
		document.getElementById('barPercentage').style.width = itemsLoaded / itemsTotal * 100 + '%';
	}

	manager.onLoad = () => {
		peer = new Peer({
			secure: true, 
			host: 'peerjs-cloud9c.herokuapp.com', 
		});
		hosting = event.target.id === 'hostSubmit';

		document.getElementById('loadingInfo').textContent = 'Connecting to server...';

		nickname = document.getElementsByClassName('nickname')[+hosting].value;
		localStorage.setItem('nickname', nickname);

		serverID = document.getElementById('join').value.trim();

		peer.on('open', (id) => {
			document.getElementById('loadingInfo').textContent = 'Connected!';
			peerID = id;
			if (hosting) {
				serverID = id;
				init();
			} else {
				const conn = peer.connect(serverID, {metadata: {nickname: nickname}});
				addNewConnection(conn);
			}
		});

		peer.on('connection', addNewConnection);

		peer.on('error', (err) => {
			console.log(err, err.type);
		})

		window.addEventListener('beforeunload', (event) => {
			event.preventDefault();
			event.returnValue = '';
		});

		window.addEventListener('unload', () => {
			peer.destroy();
		})
	}
}

document.getElementById('joinSubmit').addEventListener('submit', loadGame);
document.getElementById('hostSubmit').addEventListener('submit', loadGame);
document.getElementById('nextButton').addEventListener('click', () => {
	document.getElementById('splashPage').style.display = 'none';
	document.getElementById('hostSubmit').style.display = 'block';
})

window.addEventListener('load', () => {
	const oldNickname = localStorage.getItem('nickname');
	if (oldNickname !== null) {
		document.getElementsByClassName('nickname')[0].value = oldNickname;
		document.getElementsByClassName('nickname')[1].value = oldNickname;
	}
});