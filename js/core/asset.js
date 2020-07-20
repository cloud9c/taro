import {LoadingManager} from 'https://threejs.org/build/three.module.js';
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

const Asset = {
    init: function() {
        const manager = new LoadingManager();
        const modelLoader = new GLTFLoader(manager);
        const models = ['player.glb'];

        return new Promise((resolve, reject) => {
            const onLoad = manager.onLoad

            for (const model of models) {
                modelLoader.load('assets/models/' + model, gltf => {
                    this[model] = gltf;
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
    }
}

export default Asset;