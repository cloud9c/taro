import {
	LoadingManager,
	Skeleton,
	AnimationMixer,
	LoopOnce,
} from "./three.module.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import { SimplifyModifier } from "https://threejs.org/examples/jsm/modifiers/SimplifyModifier.js";

const Asset = {
	init() {
		const manager = new LoadingManager();
		const modelLoader = new GLTFLoader(manager);
		const models = ["player.glb"];
		this.simplifier = new SimplifyModifier();

		return new Promise((resolve, reject) => {
			for (let i = 0, len = models.length; i < len; i++) {
				modelLoader.load("assets/models/" + models[i], (gltf) => {
					gltf.scene.name = models[i];
					this.models[models[i]] = gltf;
				});
			}

			manager.onProgress = (url, itemsLoaded, itemsTotal) => {
				document.getElementById("loading-info").textContent =
					"Loading: " + url;
				document.getElementById("bar-percentage").style.width =
					(itemsLoaded / itemsTotal) * 100 + "%";
			};

			manager.onLoad = resolve;

			manager.onError = (url) => {
				console.log("Error loading " + url);
			};
		});
	},
	models: {},
	simplifiedModels: {},
	getObject3D(model) {
		const clone = this.models[model].scene.clone();

		const skinnedMeshes = {};
		const cloneBones = {};
		const cloneSkinnedMeshes = {};

		clone.traverse((node) => {
			if (node.isSkinnedMesh) {
				skinnedMeshes[node.name] = node;
			}
		});

		clone.traverse((node) => {
			if (node.isBone) {
				cloneBones[node.name] = node;
			}

			if (node.isSkinnedMesh) {
				cloneSkinnedMeshes[node.name] = node;
			}
			if (node.isMesh) {
				node.castShadow = true;
				node.receiveShadow = true;
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
				new Skeleton(orderedCloneBones, skeleton.boneInverses),
				cloneSkinnedMesh.matrixWorld
			);
		}
		return clone;
	},
	getAnimation(rootObject, model, active) {
		const mixer = new AnimationMixer(rootObject);
		const animations = Asset.models[model].animations;
		const actions = [];

		for (const animation of animations) {
			const clip = animation;
			const action = mixer.clipAction(clip);
			actions[clip.name] = action;
		}

		let activeAction = actions[active];
		activeAction.play();

		return {
			mixer: mixer,
			actions: actions,
			activeAction: activeAction,
		};
	},
	getSimplified(obj) {
		// Object3D or model name string
		let reducedObj;
		if (this.simplifiedModels.hasOwnProperty(obj.name)) {
			reducedObj = this.simplifiedModels[obj.name].clone();
		} else {
			const temp = [
				obj.position.clone(),
				obj.rotation.clone(),
				obj.scale.clone(),
			];
			obj.position.set(0, 0, 0);
			obj.rotation.set(0, 0, 0);
			obj.scale.set(1, 1, 1);

			reducedObj = obj.clone();
			const MAX_VERTICES = 100;
			let TOTAL_VERTICES = 0;

			reducedObj.traverse((node) => {
				if (node.isMesh) {
					TOTAL_VERTICES += node.geometry.attributes.position.count;
				}
			});

			const REDUCTION_FACTOR = MAX_VERTICES / TOTAL_VERTICES;

			if (REDUCTION_FACTOR < 1)
				reducedObj.traverse((node) => {
					if (node.isMesh) {
						const count = node.geometry.attributes.position.count;
						const newCount = Math.ceil(count * REDUCTION_FACTOR);
						if (newCount < count)
							node.geometry = this.simplifier.modify(
								node.geometry,
								newCount
							);
					}
				});

			obj.position.copy(temp[0]);
			obj.rotation.copy(temp[1]);
			obj.scale.copy(temp[2]);

			if (obj.name) this.simplifiedModels[obj.name] = reducedObj.clone();
		}

		return reducedObj;
	},
};

export default Asset;
