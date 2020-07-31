import * as THREE from "https://threejs.org/build/three.module.js";
import { Asset, Entity, System } from "./core/Engine.js";

export function Player() {
	const obj = Asset.getObject3D("player.glb");
	const entity = new Entity({ position: new THREE.Vector3(0, 5, 0) });

	entity.addComponent("Object3D", obj);
	entity.addComponent(
		"Animation",
		Asset.getAnimation(obj, "player.glb", "Idle")
	);
	entity.addComponent("Physics", {
		mass: 60,
	});
	entity.addComponent("Collider", {
		material: {
			dynamicFriction: 0.6,
			staticFriction: 0.6,
			bounciness: 1,
		},
	});
	System.camera.addTarget(entity);

	const keyInput = System.input.keyInput;
	const curVel = entity.components.Physics.velocity;
	const rotation = entity.components.Transform.rotation;
	const newVel = new THREE.Vector3();
	const maxSpeed = 20;
	entity.addComponent("Behavior", () => {
		newVel.set(0, 0, 0);

		if (keyInput.moveForward()) {
			if (curVel.z < 20)
				if (curVel.z > 0) newVel.z += 20 - curVel.z;
				else newVel.z += 20;
		}
		if (keyInput.moveBackward()) {
			if (curVel.z > -20)
				if (curVel.z < 0) newVel.z -= 20 + curVel.z;
				else newVel.z -= 20;
		}
		if (keyInput.strafeLeft()) {
			if (curVel.x < 20)
				if (curVel.x > 0) newVel.x += 20 - curVel.x;
				else newVel.x += 20;
		}
		if (keyInput.strafeRight()) {
			if (curVel.x > -20)
				if (curVel.x < 0) newVel.x -= 20 + curVel.x;
				else newVel.x -= 20;
		}
		if (keyInput.jump) {
		}
		if (keyInput.sprint) {
		}

		const length = Math.sqrt(newVel.x * newVel.x + newVel.y * newVel.y);
		if (length > maxSpeed) {
			newVel.x = (newVel.x / length) * maxSpeed;
			newVel.y = (newVel.y / length) * maxSpeed;
		}

		newVel.set(
			Math.sin(rotation.y) * newVel.z + Math.cos(rotation.y) * newVel.x,
			newVel.y,
			Math.cos(rotation.y) * newVel.z + Math.sin(rotation.y) * newVel.x
		);
		curVel.add(newVel);
	});
}

export function Ball() {
	const obj = Asset.getObject3D("player.glb");
	const entity = new Entity({ position: new THREE.Vector3(5, 10, 0) });

	const geo = new THREE.SphereBufferGeometry(1, 32, 32);
	const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

	entity.addComponent("Object3D", new THREE.Mesh(geo, mat));
	entity.addComponent("Physics", {
		mass: 10,
	});
	entity.addComponent("Collider", {
		material: {
			dynamicFriction: 0.6,
			staticFriction: 0.6,
			bounciness: 1,
		},
	});
}

export function Cube() {
	const obj = Asset.getObject3D("player.glb");
	const entity = new Entity({ position: new THREE.Vector3(5, 2, 0) });

	const geo = new THREE.BoxBufferGeometry(2, 2, 2);
	const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

	entity.addComponent("Object3D", new THREE.Mesh(geo, mat));
	entity.addComponent("Physics", {
		mass: 10,
	});
	entity.addComponent("Collider", {
		material: {
			dynamicFriction: 0.6,
			staticFriction: 0.6,
			bounciness: 1,
		},
	});
}

function fadeToAction(name, duration, timeScale = 1) {
	if (
		this.actions[name] === this.activeAction &&
		this.activeAction.timeScale === timeScale
	) {
		return;
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
