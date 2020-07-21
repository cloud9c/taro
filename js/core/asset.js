import {LoadingManager, Skeleton, AnimationMixer} from 'https://threejs.org/build/three.module.js';
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import {SimplifyModifier} from 'https://threejs.org/examples/jsm/modifiers/SimplifyModifier.js';

const Asset = {
    init() {
        const manager = new LoadingManager();
        const modelLoader = new GLTFLoader(manager);
        const models = ['player.glb'];

        return new Promise((resolve, reject) => {
            const onLoad = manager.onLoad

            for (const model of models) {
                modelLoader.load('assets/models/' + model, gltf => {
                    this.models[model] = gltf;
                });
            }

            manager.onProgress = (url, itemsLoaded, itemsTotal) => {
                document.getElementById('loading-info').textContent = 'Loading: ' + url;
                document.getElementById('bar-percentage').style.width = itemsLoaded / itemsTotal * 100 + '%';
            }

            manager.onLoad = () => {
                resolve();
            }

            manager.onError = (url) => {
                console.log('Error loading ' + url);
            }
        });
    },
    models: {},
    simplifiedModels: {},
    getModel(model) {
        const clone = this.models[model].scene.clone();

        const skinnedMeshes = {};
        const cloneBones = {};
        const cloneSkinnedMeshes = {};

        clone.traverse(node => {
            if (node.isSkinnedMesh) {
                skinnedMeshes[node.name] = node;
            }
        });

        clone.traverse(node => {
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
                cloneSkinnedMesh.matrixWorld);
        }
        console.log(clone)
        return clone;
    },
    getAnimation(rootObject, model, active) {
        const mixer = new AnimationMixer(rootObject);
        const animations = Asset.models[model].animations;
        // {
        //     animations: original.animations,
        //     scene: original.scene.clone()
        // };
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

        return {
            'mixer': mixer,
            'actions': actions,
            'activeAction': activeAction
        };
    }
}

export default Asset;