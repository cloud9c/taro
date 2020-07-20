import * as THREE from 'https://threejs.org/build/three.module.js';
import {Asset, Entity, System} from './core/engine.js'

let paused = false;
const keyInput = {}

class Player {
	constructor() {
		const gltf = setGltf('player.glb');
		const mesh = gltf.scene;
		const animations = gltf.animations;
		const entity = new Entity;

		entity.addComponent('Object3D', mesh);
		entity.addComponent('Animation', setAnimation(mesh, animations, 'Idle'));
		entity.addComponent('Transform', {
			position: new THREE.Vector3(0, 0, 0),
			rotation: new THREE.Euler(),
			scale: new THREE.Vector3(1, 1, 1)
		});
		entity.addComponent('Rigidbody', {
			velocity: new THREE.Vector3(),
			angularVelocity: new THREE.Vector3(0, 0, 0),
			mass: 60
		});
		entity.addComponent('Collider', {
			material: {
				dynamicFriction: 1,
				staticFriction: 1,
				elasticity: 1
			}
		});
		System.camera.addTarget(mesh);

		const keyInput = System.input.keyInput;
		const curVel = entity.components.Rigidbody.velocity;
		const rotation = entity.components.Transform.rotation;
		const newVel = new THREE.Vector3();
		const maxSpeed = 20;
		entity.addComponent('Behavior', () => {
			newVel.set(0, 0, 0);

			if (keyInput.moveForward()) {
				if (curVel.z < 20)
					if (curVel.z > 0)
						newVel.z += 20 - curVel.z;
					else
						newVel.z += 20;
			}
			if (keyInput.moveBackward()) {
				if (curVel.z > -20)
					if (curVel.z < 0)
						newVel.z -= 20 + curVel.z;
					else
						newVel.z -= 20;
			}
			if (keyInput.strafeLeft()) {
				if (curVel.x < 20)
					if (curVel.x > 0)
						newVel.x += 20 - curVel.x;
					else
						newVel.x += 20;
			}
			if (keyInput.strafeRight()) {
				if (curVel.x > -20)
					if (curVel.x < 0)
						newVel.x -= 20 + curVel.x;
					else
						newVel.x -= 20;
			}
			if (keyInput.jump) {

			}
			if (keyInput.sprint) {

			}

			length = Math.sqrt(newVel.x * newVel.x + newVel.y * newVel.y);
			if (length > maxSpeed) {
				newVel.x = newVel.x / length * maxSpeed;
				newVel.y = newVel.y / length * maxSpeed;
			}

			newVel.set((Math.sin(rotation.y) * newVel.z + Math.cos(rotation.y) * newVel.x),newVel.y,(Math.cos(rotation.y) * newVel.z + Math.sin(rotation.y) * newVel.x));
			curVel.add(newVel);
		});
	}
}

function setGltf(assetName) {
	const original = Asset[assetName];
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

	gltf.scene.traverse(node => {
		if (node.isMesh) {
			node.castShadow = true;
			node.receiveShadow = true;
		}
	});
	return gltf
}

function setAnimation(mesh, animations, active) {
	const mixer = new THREE.AnimationMixer(mesh);

	const actions = [];

	for (const animation of animations) {
		const clip = animation;
		const action = mixer.clipAction(clip);
		if (clip.name === 'Jump' && clip.name === 'WalkJump') {
			action.setLoop(THREE.LoopOnce);
		}
		actions[clip.name] = action;
	}

	let activeAction = actions[active];
	activeAction.play();

	return 	{
		'mixer': mixer,
		'actions': actions,
		'activeAction': activeAction
	};
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

export {Player}