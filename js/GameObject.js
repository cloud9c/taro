import * as THREE from 'https://threejs.org/build/three.module.js';
import {
	Asset,
	Entity,
	System
} from './core/engine.js'

let paused = false;
const keyInput = {}

function Player() {
	const mesh = Asset.getModel('player.glb');
	const entity = new Entity();

	entity.addComponent('Object3D', mesh);
	entity.addComponent('Animation', Asset.getAnimation(mesh, 'player.glb', 'Idle'));
	entity.addComponent('Transform', {
		position: new THREE.Vector3(0, 100, 0),
		rotation: new THREE.Euler(),
		scale: new THREE.Vector3(1, 1, 1)
	});
	entity.addComponent('Physics', {
		velocity: new THREE.Vector3(),
		angularVelocity: new THREE.Vector3(),
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
	const curVel = entity.components.Physics.velocity;
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

		newVel.set((Math.sin(rotation.y) * newVel.z + Math.cos(rotation.y) * newVel.x), newVel.y, (Math.cos(rotation.y) * newVel.z + Math.sin(rotation.y) * newVel.x));
		curVel.add(newVel);
	});
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

export {
	Player
}