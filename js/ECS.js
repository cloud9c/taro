import * as THREE from 'https://threejs.org/build/three.module.js';

class Entity {
    constructor() {
        this.components = new Object();
        this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16);

        Entity.entities[this.id] = this.components;
    }

    static entities = new Object();

    addComponent(type, data = null) { // EX: 'Transform', {'position': [0, 0, 0], 'rotation': [0, 0, 0], 'scale': [1, 1, 1]}
        Component[type](this.id, type, data);
        this.components[type] = Component.components[type][this.id];
        return this.components[type];
    }

    removeComponent(type) {
        delete Component.components[type][this.id];
        delete this.components[type];
    }
}

function setDataComponent(id, type, data) {
    Component.components[type][id] = data;
}

function setSceneComponent(id, type, data) {
    setDataComponent(id, type, data);
    console.log(System.scene)
    System.scene.add(data);
}

function setBooleanComponent(id, type) {
    Component.components[type].push(id)
}

const Component = {
    init: function() {
        const components = this.components;
        const componentTypes = Object.keys(Component);
        componentTypes.splice(componentTypes.indexOf('components'), 1);

        for (let i = 0, len = componentTypes.length; i < len; i++) {
            if (this[componentTypes[i]].name === 'setBooleanComponent') {
                components[componentTypes[i]] = new Array();
            } else {
                components[componentTypes[i]] = new Object();
            }
        }
    },

    components: new Object(),

    AABB: setSceneComponent,
    Animate: setDataComponent,
    Collider: setBooleanComponent,
    Interactable: setDataComponent,
    Object3D: function(id, type, data) {
        const transform = this.components.Transform.id;
        if (transform) {
            data.position.set(...transform.position)
            data.rotation.set(...transform.rotation) 
            data.scale.set(...transform.scale)
        }
        setSceneComponent(id, type, data)
    },
    PlayerControlled: setDataComponent,
    RigidBody: setDataComponent,
    Transform: setDataComponent
}

Component.init();

const System = {
    init: function (config) {
        this.config = config;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0080ff);
        this.scene = scene;
        this.paused = false;
    },
    camera: {
        init: function(target) {
            const config = System.config;

            let aspectRatio = window.innerWidth / window.innerHeight;
            if (config.aspectRatio != 'native') {
                const configRatio = config.aspectRatio.split(':');
                aspectRatio = configRatio[0]/configRatio[1];
            }

            const camera = new THREE.PerspectiveCamera(+config.fov, aspectRatio, 1, +config.renderDistance);

            camera.position.set(0, 3.8, 0);
            camera.rotation.set(0, Math.PI, 0);
            target.add(camera);
            this.cameraRadius = Math.sqrt(camera.position.z * camera.position.z + camera.position.y * camera.position.y);
            this.cameraAngle = Math.acos(-camera.position.z / this.cameraRadius);
            this.perspectiveCamera = camera;
            this.firstPerson = true;
        },
        update: function() {
            console.log(this.perspectiveCamera.rotation)

            const camera = this.perspectiveCamera;
            const keyInput = System.input.keyInput;

            camera.rotation.y -= keyInput.MouseX;
            
            if (keyInput.MouseY != 0) {
                const newCameraAngle = this.cameraAngle + keyInput.MouseY;
                const newX = camera.rotation.x + keyInput.MouseY;
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

            if (keyInput.WheelY != 0) {
                if (keyInput.WheelY < 0) {
                    camera.zoom = Math.max(camera.zoom - 0.05, 1);
                    if (this.firstPerson) {
                        this.firstPerson = false;
                        // this.mesh.traverse(node => {
                        //     if (node.material) {
                        //         node.material.colorWrite = true;
                        //         node.material.depthWrite = true;
                        //     }
                        // });
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
                            // this.mesh.traverse(node => {
                            //     if (node.material) {
                            //         node.material.colorWrite = false;
                            //         node.material.depthWrite = false;
                            //     }
                            // });
                            camera.position.set(0, 4, 0);
                            camera.rotation.set(0, Math.PI, 0);
                            camera.zoom = 1;
                        } else {
                            camera.zoom = Math.min(newZoom, 1.65);
                        }
                    }
                }
                camera.updateProjectionMatrix();
            }
        }
    },
    input: {
        init: function () {
            const config = System.config;

            this.PlayerControlled = Component.components.PlayerControlled;
            this.sensitivityX = config.mouseSensitivity / 1400;
            this.sensitivityY = config.mouseSensitivity / 1400;
            if (config.mouseInvert === 'true')
                this.sensitivityY *= -1;

            const keyInput = {MouseX: 0, MouseY: 0, WheelX: 0, WheelY: 0};

            document.getElementById('c').addEventListener('click', () => {
                if (config.displayMode === 'fullscreen')
                    document.body.requestFullscreen();
                document.body.requestPointerLock();
            });

            window.addEventListener('blur', () => {
                for (const property in keyInput) {
                    if (typeof keyInput[property] === 'boolean')
                        keyInput[property] = false;
                    else
                        keyInput[property] = 0;
                }
            });

            window.addEventListener('resize', () => {
                System.camera.perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
                System.camera.perspectiveCamera.updateProjectionMatrix();
                System.render.renderer.setSize(window.innerWidth, window.innerHeight);
            });

            document.addEventListener('mousemove', (event) => {
                if (System.paused)
                    return;

                keyInput.MouseX = event.movementX * this.sensitivityX;
                keyInput.MouseY = event.movementY * this.sensitivityY;
            });

            document.addEventListener('wheel', (event) => {
                if (System.paused)
                    return;

                keyInput.WheelX = event.wheelDeltaX;
                keyInput.WheelY = event.wheelDeltaY;
            });

            document.addEventListener('keydown', (event) => {
                if (event.repeat)
                    return;

                const key = event.code;
                keyInput[key] = true;

                if (key === 'Tab') {
                    event.preventDefault();
                    if (System.paused) {
                        System.paused = false;
                        document.getElementById('menu').style.display = 'none';
                        if (config.displayMode === 'fullscreen')
                            document.body.requestFullscreen();
                        document.body.requestPointerLock();
                    } else {
                        System.paused = true;
                        document.getElementById('menu').style.display = '';
                        document.exitPointerLock();
                        for (const property in keyInput)
                            keyInput[property] = false;
                    }
                }
            });

            document.addEventListener('keyup', (event) => {
                const key = event.code;
                keyInput[key] = false;
            });

            document.getElementById('setting-back').addEventListener('click', () => {
                System.paused = false;
                document.getElementById('menu').style.display = 'none';
                if (config.displayMode === 'fullscreen')
                    document.body.requestFullscreen();
                document.body.requestPointerLock();
            });

            this.keyInput = keyInput;
        },
        update: function() {
            this.keyInput.MouseX = 0;
            this.keyInput.MouseY = 0;
            this.keyInput.WheelX = 0;
            this.keyInput.WheelY = 0;
            // for (const entity in this.PlayerControlled) {
            // }
        }
    },
    movement: {
        init: () => {

        },
        update: (dt) => {

        }
    },
    render: {
        init: function() {
            const config = System.config;

            const renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('c'),
                precision: config.shadowPrecision,
                antialias: config.antiAliasing === 'true',
                powerPreference: config.powerPreference,

            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE[config.shadowMap];
            renderer.physicallyCorrectLights = config.physicallyCorrectLights === 'true';
            renderer.toneMapping = THREE[config.toneMap]

            renderer.setPixelRatio(+config.resolution);
            this.renderer = renderer;

            const maxFiltering = renderer.capabilities.getMaxAnisotropy();
            const filterLevels = document.querySelector('select[name=textureFiltering]').children;
            for (let i = filterLevels.length - 1; i >= 0; i--) {
                const element = filterLevels[i];
                if (element.value > maxFiltering) {
                    element.remove();
                }
            }

            this.scene = System.scene;
            this.camera = System.camera.perspectiveCamera;
        },
        update: function() {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

export {
    Entity,
    Component,
    System
};