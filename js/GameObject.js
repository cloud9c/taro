import * as THREE from 'https://threejs.org/build/three.module.js';
import {scene, renderer, camera, lastTimestamp, dt, config, assets, peerID, connections} from '/js/main.js';

let paused = false;
const keyEnum = {}

class Player {
	constructor() {
		this.xVel = 0;
		this.yVel = 0;
		this.zVel = 0;

		const configControls = ['moveForward', 'moveBackward', 'strafeLeft', 'strafeRight', 'jump', 'sprint'];
		this.controls = {};
		for (const control of configControls)
			this.controls[control] = config[control];
		this.walkingSpeed = 10;
		this.sprintFactor = 2;
		this.speed = this.walkingSpeed;
		this.sprinting = false;

		this.sensitivityX = config['mouseSensitivity'] / 1400;
		this.sensitivityY = config['mouseSensitivity'] / 1400;
		if (config['mouseInvert'] === 'true')
			this.sensitivityY *= -1;

		this.onGround = true;
		this.jumpVel = 8;
		this.gravity = this.jumpVel * 2.5;
		this.firstPerson = true;

		const mesh = setGltf.call(this, 'player.glb', true);

		mesh.traverse(node => {
			if (node.material) {
				node.material.colorWrite = false;
				node.material.depthWrite = false;
			}
		});	

		// aabb
		this.aabb = new THREE.Box3().setFromObject(mesh.children[0].children[0]);
		var helper = new THREE.Box3Helper( this.aabb, 0xffff00 );
		scene.add( helper );

		// camera setting
		camera.position.set(0, 3.8, 0);
		camera.rotation.set(0, Math.PI, 0);
		this.cameraRadius = Math.sqrt(camera.position.z * camera.position.z + camera.position.y * camera.position.y);
		this.cameraAngle = Math.acos(-camera.position.z / this.cameraRadius);
		mesh.add(camera);

		scene.add(mesh);

		console.log(scene)

		this.addEventListeners();
	}

	addEventListeners() {
		document.getElementById('c').addEventListener('click', () => {
			if (config['displayMode'] === 'fullscreen')
				document.body.requestFullscreen();
			document.body.requestPointerLock();
		});

		window.addEventListener('blur', () => {
			for (const property in keyEnum) {
				keyEnum[property] = false;
			}
		});

		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});

		document.addEventListener('mousemove', (event) => {
			if (paused)
				return;
			const sensitivityX = this.sensitivityX;
			const sensitivityY = this.sensitivityY;

			const dx = event.movementX * sensitivityX
			const dy = event.movementY * sensitivityY

			this.mesh.rotation.y -= dx;
			if (dy != 0) {
				const newCameraAngle = this.cameraAngle + dy;
				const newX = camera.rotation.x + dy;
				if (this.firstPerson) {
					if (newX < 1.5 && newX > -1.5)
						camera.rotation.x = newX;
				} else if (newCameraAngle < 1.1 && newCameraAngle > 0.1) {
					this.cameraAngle = newCameraAngle;
					camera.position.z = -Math.cos(newCameraAngle) * this.cameraRadius;
					camera.position.y = Math.sin(newCameraAngle) * this.cameraRadius;
					camera.rotation.x = newX;
				}	
			}
		});

		document.addEventListener('wheel', (event) => {	
			if (paused)	
				return;

			if (event.wheelDeltaY < 0) {	
				camera.zoom = Math.max(camera.zoom - 0.05, 1);	
				if (this.firstPerson) {	
					this.firstPerson = false;
					this.mesh.traverse(node => {
						if (node.material) {
							node.material.colorWrite = true;
							node.material.depthWrite = true;
						}
					});	
					camera.position.set(-2, 10, -15);	
					camera.rotation.set(-160 * Math.PI / 180, 0, Math.PI);	
					this.cameraRadius = Math.sqrt(camera.position.z * camera.position.z + camera.position.y * camera.position.y);	
					this.cameraAngle = Math.acos(-camera.position.z / this.cameraRadius);	
					camera.zoom = 1.65;	
				}	
			} else {	
				const newZoom = camera.zoom + 0.05;	
				if (!this.firstPerson) {
					if (camera.zoom >= 1.65) {
						this.firstPerson = true;
						this.mesh.traverse(node => {
							if (node.material) {
								node.material.colorWrite = false;
								node.material.depthWrite = false;
							}
						});	
						camera.position.set(0, 4, 0);	
						camera.rotation.set(0, Math.PI, 0);	
						camera.zoom = 1;	
					} else {	
						camera.zoom = Math.min(newZoom, 1.65);	
					}	
				}	
			}	
			camera.updateProjectionMatrix();	
		});

		document.addEventListener('keydown', (event) => {
			if (event.repeat)
				return;

			const key = event.code;
			keyEnum[key] = true;

			if (key === 'Tab') {
				event.preventDefault();
				if (paused) {
					paused = false;
					document.getElementById('menu').style.display = 'none';
					if (config['displayMode'] === 'fullscreen')
						document.body.requestFullscreen();
					document.body.requestPointerLock();
				} else {
					paused = true;
					document.getElementById('menu').style.display = '';
					document.exitPointerLock();
					for (const property in keyEnum)
						keyEnum[property] = false;
				}
			}
		});

		document.addEventListener('keyup', (event) => {
			const key = event.code;
			keyEnum[key] = false;
		});

		document.getElementById('setting-back').addEventListener('click', () => {
			paused = false;
			document.getElementById('menu').style.display = 'none';
			if (config['displayMode'] === 'fullscreen')
				document.body.requestFullscreen();
			document.body.requestPointerLock();
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
		} else {
			yVel = 0;
			pos.y = 0;
		}

		if (!paused) {
			if (keyEnum[controls['moveForward']]) {
				zVel -= 1;
			}
			if (keyEnum[controls['moveBackward']]) {
				zVel += 1;
			}
			if (keyEnum[controls['strafeLeft']]) {
				xVel -= 1;
			}
			if (keyEnum[controls['strafeRight']]) {
				xVel += 1;
			}
			if (pos.y === 0) {
				if (keyEnum[controls['jump']]) {
					yVel += this.jumpVel;
					let jump = 'WalkJump'
					if (xVel === 0 && zVel === 0)
						jump = 'Jump'
					fadeToAction.call(this, jump, 0.4);
				}
				if (keyEnum[controls['sprint']]) {
					speed *= this.sprintFactor;
				}
			}
		}

		const magnitude = Math.sqrt(xVel * xVel + zVel * zVel);
		if (magnitude > 1) {
			xVel = xVel / magnitude;
			zVel = zVel / magnitude;
		}

		let dir = 1
		if (xVel > 0 || zVel > 0) {
			dir = -1;
		}

		if (yVel === 0) { // maybe too spammy? TODO
			if (speed > this.walkingSpeed || speed > this.walkingSpeed) {
				fadeToAction.call(this, 'Running', 0.2, dir);
			} else if (Math.abs(xVel) > 0 || Math.abs(zVel) > 0) {
				fadeToAction.call(this, 'Walking', 0.2, dir);
			} else {
				fadeToAction.call(this, 'Idle', 0.2);
			}
		}

		const dx = (Math.sin(this.mesh.rotation.y + Math.PI) * zVel - Math.cos(this.mesh.rotation.y) * xVel) * dt * speed;
		const dy = yVel * dt;
		const dz = (Math.cos(this.mesh.rotation.y + Math.PI) * zVel + Math.sin(this.mesh.rotation.y) * xVel) * dt * speed;

		pos.x += dx;
		pos.y += yVel * dt;
		pos.z += dz;

		this.aabb.translate(new THREE.Vector3(dx, dy, dz))

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
	constructor(id) {
		this.pos = new THREE.Vector3(0, 0, 0);
		this.rotationY = 0;
		this.id = id;

		if (hosting) {
			connections[id][0].send({
				type: 'playerList',
				playerList: Object.keys(connections)
			});
		}
		const mesh = setGltf.call(this, 'player.glb', false);
		this.animationName = 'Idle';
		this.animationDir = 1;

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

	addOverhead(message) {
		const fontsize = 24;
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = 512;
		tempCanvas.height = 256;
		const context = tempCanvas.getContext('2d');
		context.font = 'Bold ' + fontsize + 'px sans-serif';
		context.fillStyle = 'rgba(255, 255, 255, 0.5)';
		context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
		context.fillStyle = '#000';
		context.fillText(message, (tempCanvas.width) / 2 - context.measureText(message).width / 2, fontsize);

		const texture = new THREE.Texture(tempCanvas)
		texture.needsUpdate = true;
		const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
			map: texture
		}));
		sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);

		const overhead = sprite;
		overhead.position.setY(2.8);
		this.mesh.add(overhead);
	}
}

class PhysicsProp {

}

class StaticProp {

}

class Item {

}

function setGltf(assetName) {
	const original = assets[assetName];
	const gltf = {
		animations: original.animations,
		scene: original.scene.clone()
	};

	const skinnedMeshes = {};
	const cloneBones = {};
	const cloneSkinnedMeshes = {};

	original.scene.traverse(node => {
		if (node.isSkinnedMesh) {
			skinnedMeshes[node.name] = node;
		}
	});

	gltf.scene.traverse(node => {
		if (node.isBone) {
			cloneBones[node.name] = node;
		}

		if (node.isSkinnedMesh) {
			cloneSkinnedMeshes[node.name] = node;
		}
	});

	for (const name in skinnedMeshes) {
		const skinnedMesh = skinnedMeshes[name];
		const skeleton = skinnedMesh.skeleton;
		const cloneSkinnedMesh = cloneSkinnedMeshes[name];

		const orderedCloneBones = [];

		for (const bone of skeleton.bones) {
			const cloneBone = cloneBones[bone.name];
			orderedCloneBones.push(cloneBone);
		}

		cloneSkinnedMesh.bind(
			new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
			cloneSkinnedMesh.matrixWorld);
	}

	const mesh = gltf.scene;
	let actions = [];

	mesh.traverse(node => {
		if (node.isMesh) {
			node.castShadow = true;
			node.receiveShadow = true;
		}
	});

	// Animation
	const mixer = new THREE.AnimationMixer(mesh);

	for (const animation of gltf.animations) {
		const clip = animation;
		const action = mixer.clipAction(clip);
		if (clip.name === 'Jump' && clip.name === 'WalkJump') {
			action.setLoop(THREE.LoopOnce);
		}
		actions[clip.name] = action;
	}

	let activeAction = actions['Idle'];
	activeAction.play();
	this.mixer = mixer;
	this.actions = actions;
	this.activeAction = activeAction;
	this.mesh = mesh;

	return mesh
}

function fadeToAction(name, duration, timeScale = 1) {
	if (this.actions[name] === this.activeAction && this.activeAction.timeScale === timeScale) {
		return
	}

	const previousAction = this.activeAction;
	this.activeAction = this.actions[name];

	previousAction.fadeOut(duration);

	this.activeAction
		.reset()
		.setEffectiveTimeScale(timeScale)
		.setEffectiveWeight(1)
		.fadeIn(duration)
		.play();
}

export {Player, OtherPlayer, PhysicsProp, StaticProp, Item}