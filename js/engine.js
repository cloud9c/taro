import * as THREE from 'https://threejs.org/build/three.module.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { ConvexHull } from 'https://threejs.org/examples/jsm/math/ConvexHull.js';

class Entity {
    constructor() {
        this.components = new Object();
        this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16);

        Entity.entities[this.id] = this.components;
    }

    static entities = new Object();

    addComponent(type, data = null) {
        Component[type](this.id, type, data);
        this.components[type] = Component.components[type][this.id];
        return this;
    }

    removeComponent(type) {
        delete Component.components[type][this.id];
        delete this.components[type];
        return this;
    }
}

function setDataComponent(id, type, data) {
    Component.components[type][id] = data;
}

const Component = {
    Animation: setDataComponent,
    Behavior: setDataComponent,
    Collider: (id, type, data) => {
        const obj = Component.components.Object3D[id];
        if (obj === undefined)
            throw 'Object3D dependency';
        data.boundingBox = new THREE.Box3().setFromObject(obj);
        data.Object3D = obj;
        setDataComponent(id, type, data);
    },
    Interactable: setDataComponent,
    Object3D: (id, type, data) => {
        const transform = Component.components.Transform[id];
        if (transform) {
            transform.position = data.position.copy(transform.position);
            transform.rotation = data.rotation.copy(transform.rotation);
            transform.scale = data.scale.copy(transform.scale);
        }
        setDataComponent(id, type, data);
        System.render.scene.add(data);
    },
    Rigidbody: (id, type, data) => {
        data.isMoving = function() {
            return this.velocity.x != 0 && this.velocity.z != 0;
        };
        data.isGrounded = function() {
            return this.velocity.y == 0;
        };
        setDataComponent(id, type, data);
    },
    Transform: (id, type, data) => {
        const object = Component.components.Object3D[id];
        if (object) {
            data.position = object.position.copy(data.position);
            data.rotation = object.rotation.copy(data.rotation);
            data.scale = object.scale.copy(data.scale);
        }
        setDataComponent(id, type, data);
    }
}

Object.defineProperty(Component, 'components', {value: new Object(), enumerable: false });
for (const type in Component) {
    Component.components[type] = new Object();
}

function applyChanges(name) {
    const config = System.config;
    switch(name) {
        case 'mouseSensitivity':
            System.input.sensitivityX = config.mouseSensitivity / 1400;
            System.input.sensitivityY = config.mouseSensitivity / 1400;
            break;
        case 'mouseInvert':
            if (config.mouseInvert === 'true')
                System.input.sensitivityY *= -1;
            break;
        case 'resolution':
            System.render.renderer.setPixelRatio(+config.resolution);
            break;
        case 'brightness':
            document.getElementById('c').style.filter = 'brightness(' + (+config.brightness + 50)/100 + ')';
            break;
        case 'fov':
            System.camera.perspectiveCamera.fov = +config.fov;
            break;
        case 'aspectRatio':
            let aspectRatio = window.innerWidth / window.innerHeight;
            if (config.aspectRatio != 'native') {
                const configRatio = config.aspectRatio.split(":");
                aspectRatio = configRatio[0]/configRatio[1];
            }
            System.camera.perspectiveCamera.aspect = aspectRatio;
            break;
        case 'renderDistance':
            System.camera.perspectiveCamera.far = +config.renderDistance;
            break;
    }
    System.camera.perspectiveCamera.updateProjectionMatrix();
}

const System = {
    init() {
        //init config
        let config;
        const cachedConfig = localStorage.getItem('config');
        const cached = cachedConfig !== null;

        if (cached)
            config = JSON.parse(cachedConfig);
        else
            config = {controls:{}};

        this.config = config;

        //init menu
        for (const element of document.getElementById('menu-sidebar').children) {
            element.addEventListener('click', () => {
                document.querySelector('.setting-label[data-selected]').removeAttribute('data-selected');
                document.querySelector('.setting[data-selected]').removeAttribute('data-selected');
                element.setAttribute('data-selected', '');
                document.querySelector('.setting[data-setting=' + element.getAttribute('data-setting') + ']').setAttribute('data-selected', '');
            })
        }

        for (const element of document.querySelectorAll('.setting input:not([type=number]), .setting select')) {
            if (element.type === 'text') {
                if (!cached || !config.controls.hasOwnProperty(element.name))
                    config.controls[element.name] = element.getAttribute('data-default');
                else
                    element.value = config.controls[element.name];
            }
            else {
                if (!cached || !config.hasOwnProperty(element.name))
                    config[element.name] = element.getAttribute('data-default');
                else
                    element.value = config[element.name];
            }

            switch (element.type) {
                case 'range':   
                    const percent = 100 * (element.value - element.getAttribute('min')) / (element.getAttribute('max') - element.getAttribute('min'));
                    element.style.background = 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ' + percent + '%, rgba(255,255,255,0.4) ' + percent + '%, rgba(255,255,255,0.4) 100%)';
                    element.nextElementSibling.value = element.value;
                    element.addEventListener('input', function() {
                        const percent = 100 * (this.value - this.getAttribute('min')) / (this.getAttribute('max') - this.getAttribute('min'));
                        this.style.background = 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ' + percent + '%, rgba(255,255,255,0.4) ' + percent + '%, rgba(255,255,255,0.4) 100%)'
                        this.nextElementSibling.value = this.value;
                        config[this.name] = this.value;
                        applyChanges(this.name);
                    });
                    break;
                case 'text':
                    element.addEventListener('keydown', function(event) {
                        const key = event.code;

                        if (key === 'Tab')
                            return;

                        const controls = document.querySelectorAll('input[type=text]');
                        for (const control of controls) {
                            if (control.value === key) {
                                config.controls[control.name] = control.value = '';
                            }
                        }
                        config.controls[this.name] = this.value = key;
                        this.blur();
                    });
                    element.nextElementSibling.addEventListener('click', () => {
                        System.input.controls[element.name] = config.controls[element.name] = element.value = ''
                    });
                    break;
                default:
                    element.addEventListener('input', function() {
                        config[this.name] = this.value;
                        applyChanges(this.name);
                    }); 
            }
        }

        document.getElementById('restore-defaults').addEventListener('click', () => {
            for (const element of document.querySelectorAll('.setting[data-selected] input:not([type=number]), .setting select')) {
                const dataDefault = element.getAttribute('data-default');

                if (element.type === 'range') {
                    const percent = 100 * (dataDefault - element.getAttribute('min')) / (element.getAttribute('max') - element.getAttribute('min'));
                    element.style.background = 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ' + percent + '%, rgba(255,255,255,0.4) ' + percent + '%, rgba(255,255,255,0.4) 100%)';
                    element.nextElementSibling.value = dataDefault;
                }

                element.value = dataDefault
                if (element.type === 'text')
                    config.controls[element.name] = dataDefault;
                else
                    config[element.name] = dataDefault;
                applyChanges(element.name);
            }
        });
    },
    animation: {
        init() {
            this.Animation = Component.components.Animation
        },
        update() {
            for (const entity in this.Animation) {
                this.Animation[entity].mixer.update();
            }
        }
    },
    behavior: {
        init() {
            this.Behavior = Component.components.Behavior;
        },
        update() {
            for (const entity in this.Behavior) {
                this.Behavior[entity]();
            }
        }
    },
    camera: {
        init() {
            const config = System.config;

            let aspectRatio = window.innerWidth / window.innerHeight;
            if (config.aspectRatio != 'native') {
                const configRatio = config.aspectRatio.split(':');
                aspectRatio = configRatio[0]/configRatio[1];
            }
            const camera = new THREE.PerspectiveCamera(+config.fov, aspectRatio, 1, +config.renderDistance);
            camera.rotation.order = "YXZ";
            this.perspectiveCamera = camera;
        },
        thirdPersonMode() {
            const camera = this.perspectiveCamera;
            this.firstPerson = false;
            if (!this.renderFirstPerson)
                camera.parent.traverse(node => {
                    if (node.material) {
                        node.material.colorWrite = true;
                        node.material.depthWrite = true;
                    }
                });
            camera.position.set(-2, 10, -15);
            camera.rotation.set(-160 * Math.PI / 180, 0, Math.PI);
            this.cameraRadius = Math.sqrt(camera.position.z * camera.position.z + camera.position.y * camera.position.y);
            this.cameraArc = Math.acos(-camera.position.z / this.cameraRadius);
            this.matrix = new THREE.Matrix4();
            camera.zoom = 1.65;
        },
        firstPersonMode() {
            const camera = this.perspectiveCamera;
            this.firstPerson = true;
            if (!this.renderFirstPerson)
                camera.parent.traverse(node => {
                    if (node.material) {
                        node.material.colorWrite = false;
                        node.material.depthWrite = false;
                    }
                });
            camera.position.set(0, 4, 0);
            camera.rotation.set(0, Math.PI, 0);
            camera.zoom = 1;
        },
        addTarget(target, firstPerson=true, renderFirstPerson=false) {
            target.add(this.perspectiveCamera);

            this.renderFirstPerson = renderFirstPerson;
            
            if (firstPerson)
                this.firstPersonMode();
            else
                this.thirdPersonMode();
        },
        update() {
            const camera = this.perspectiveCamera;
            const keyInput = System.input.keyInput;

            if (keyInput.MouseX != 0) { // temp solution
                camera.parent.rotation.y -= keyInput.MouseX
            }
            
            if (keyInput.MouseY != 0) {
                if (this.firstPerson) {
                    const newX = camera.rotation.x - keyInput.MouseY;
                    if (newX < 1.5 && newX > -1.5)
                        camera.rotation.x = newX;
                } else {
                    const newCameraArc = this.cameraArc + keyInput.MouseY;
                    if (newCameraArc < 1.1 && newCameraArc > 0.1) {
                        const newX = camera.rotation.x + keyInput.MouseY;
                        this.cameraArc = newCameraArc;
                        camera.position.z = -Math.cos(newCameraArc) * this.cameraRadius;
                        camera.position.y = Math.sin(newCameraArc) * this.cameraRadius;
                        camera.rotation.x = newX;
                    }
                }
            }

            if (keyInput.WheelY != 0) {
                if (keyInput.WheelY < 0) {
                    camera.zoom = Math.max(camera.zoom - 0.05, 1);
                    if (this.firstPerson) {
                        this.thirdPersonMode();
                    }
                } else {
                    const newZoom = camera.zoom + 0.05;
                    if (!this.firstPerson) {
                        if (camera.zoom >= 1.65) {
                            this.firstPersonMode();
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
        init() {
            const config = System.config;
            this.sensitivityX = config.mouseSensitivity / 1400;
            this.sensitivityY = config.mouseSensitivity / 1400;
            if (config.mouseInvert === 'true')
                this.sensitivityY *= -1;

            const keyInput = {MouseX: 0, MouseY: 0, WheelX: 0, WheelY: 0};

            for (const control in System.config.controls) {
                keyInput[control] = () => {
                    return keyInput[System.config.controls[control]] || false;
                };
            }

            document.getElementById('c').addEventListener('click', () => {
                if (config.displayMode === 'fullscreen')
                    document.body.requestFullscreen();
                document.body.requestPointerLock();
            });

            window.addEventListener('blur', () => {
                for (const property in keyInput) {
                    if (typeof keyInput[property] === 'boolean')
                        keyInput[property] = false;
                    else if (typeof keyInput[property] === 'number')
                        keyInput[property] = 0;
                }
            });

            window.addEventListener('resize', () => {
                System.camera.perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
                System.camera.perspectiveCamera.updateProjectionMatrix();
                System.render.renderer.setSize(window.innerWidth, window.innerHeight);
            });

            document.getElementById('setting-back').addEventListener('click', () => {
                document.getElementById('menu').style.display = 'none';
                if (config.displayMode === 'fullscreen')
                    document.body.requestFullscreen();
                document.body.requestPointerLock();
            });

            window.addEventListener('beforeunload', (event) => {
                event.preventDefault();
                localStorage.setItem('config', JSON.stringify(System.config));
                event.returnValue = '';
            });

            const onMouseMove = (event) => {
                keyInput.MouseX = event.movementX * this.sensitivityX;
                keyInput.MouseY = event.movementY * this.sensitivityY;
            }

            const onWheel = () => {
                keyInput.WheelX = event.wheelDeltaX;
                keyInput.WheelY = event.wheelDeltaY;
            }

            const onKeyDown = () => {
                if (event.repeat)
                    return;

                keyInput[event.code] = true;

                if (event.code === 'Tab') {
                    enterMenu()
                    document.getElementById('menu').style.display = '';
                    document.exitPointerLock();
                }

            }

            const onMenuKeyDown = () => {
                if (event.code === 'Tab') {
                    document.getElementById('menu').style.display = 'none';
                    exitMenu();
                    if (config.displayMode === 'fullscreen')
                        document.body.requestFullscreen();
                    document.body.requestPointerLock();
                }
            }

            const onKeyUp = () => {
                keyInput[event.code] = false;
            }

            const exitMenu = () => {
                document.removeEventListener('keydown', onMenuKeyDown);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('wheel', onWheel);
                document.addEventListener('keydown', onKeyDown);
                document.addEventListener('keyup', onKeyUp);
            }

            const enterMenu = () => {
                document.addEventListener('keydown', onMenuKeyDown);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('wheel', onWheel);
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);            
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('wheel', onWheel);
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);

            this.keyInput = keyInput;
        },
        update() {
            const keyInput = this.keyInput;
            keyInput.MouseX = 0;
            keyInput.MouseY = 0;
            keyInput.WheelX = 0;
            keyInput.WheelY = 0;
        }
    },
    physics: {
        init() {
            this.Rigidbody = Component.components.Rigidbody;
            this.Transform = Component.components.Transform;
            this.Object3D = Component.components.Object3D;
        },
        update(dt) {
            const Rigidbody = this.Rigidbody;
            const Transform = this.Transform;
            for (const entity in Rigidbody) {
                const physics = Rigidbody[entity];
                physics.velocity.add(physics.acceleration.clone().multiplyScalar(dt));
                Transform[entity].position.add(physics.velocity.clone().multiplyScalar(dt));
            }
        }
    },
    collision: {
        init() {
            this.Collider = Component.components.Collider;
        },
        getFurthestPointInDirection(verts, dir) {
            let index = 0;
            let maxDot = -Infinity;
        
            for (let i = 0; i < verts.length; i++) {
                const dot = verts[i].point.clone().dot(dir);
        
                if (dot > maxDot) {
                    maxDot = dot;
                    index = i;
                }
            }

            return verts[index].point;
        },
        support(aVerts, bVerts, dir) {
            const a = this.getFurthestPointInDirection(aVerts, dir);
            const b = this.getFurthestPointInDirection(bVerts, dir.clone().negate());
            return a.clone().sub(b);
        },
        evaluateAndChangeDir(simplex, dir) {
            let ab, ac, ad, a0, ba, bc, bd, b0;
            switch(simplex.length) {
                case 2:
                    ab = simplex[1].clone().sub(simplex[0]);
                    a0 = simplex[0].clone().negate();
                    dir.copy(ab.clone().cross(a0).cross(ab));
        
                    return false;
                case 3:
                    ab = simplex[1].clone().sub(simplex[0]);
                    ac = simplex[2].clone().sub(simplex[0]);
                    dir.copy(ab.cross(ac));
        
                    a0 = simplex[0].clone().negate();
                    if (a0.dot(dir) < 0)
                        dir.negate();
                    
                    return false;
                case 4:
                    //face abc
                    ab = simplex[1].clone().sub(simplex[0]);
                    ac = simplex[2].clone().sub(simplex[0]);
                    dir.copy(ab.cross(ac).normalize());
        
                    ad = simplex[3].clone().sub(simplex[0]);
                    if (ad.dot(dir) > 0) {
                        dir.negate();
                    }
                    
                    a0 = simplex[0].clone().negate();
                    if (a0.dot(dir) > 0) {
                        //remove d
                        simplex.splice(3, 1);
                        return false;
                    }
        
                    //face abd
                    ab = simplex[1].clone().sub(simplex[0]);
                    ad = simplex[3].clone().sub(simplex[0]);
                    dir.copy(ab.cross(ad).normalize());
        
                    ac = simplex[2].clone().sub(simplex[0]);
                    if (ac.dot(dir) > 0) {
                        dir.negate();
                    }
        
                    a0 = simplex[0].clone().negate();
                    if (a0.dot(dir) > 0) {
                        //remove c
                        simplex.splice(2, 1);
                        return false;
                    }
        
                    //face acd
                    ac = simplex[2].clone().sub(simplex[0]);
                    ad = simplex[3].clone().sub(simplex[0]);
                    dir.copy(ac.cross(ad).normalize());
        
                    ab = simplex[1].clone().sub(simplex[0]);
                    if (ab.dot(dir) > 0) {
                        dir.negate();
                    }
        
                    a0 = simplex[0].clone().negate();
                    if (a0.dot(dir) > 0) {
                        //remove b
                        simplex.splice(1, 1);
                        return false;
                    }
        
                    //face bcd
                    bc = simplex[2].clone().sub(simplex[1]);
                    bd = simplex[3].clone().sub(simplex[1]);
                    dir.copy(bc.cross(bd).normalize());
        
                    ba = simplex[0].clone().sub(simplex[1]);
                    if (ba.dot(dir) > 0) {
                        dir.negate();
                    }
        
                    b0 = simplex[1].clone().negate();
                    if (b0.dot(dir) > 0) {
                        //remove a
                        simplex.splice(0, 1);
                        return false;
                    }
        
                    //origin is in center
                    return true;
            }
        },
        expand(simplex, simplexFaces, extendPoint) {
            //def can make all this more efficient
            const removalFaces = [];
            for (let i = 0, len = simplexFaces.length; i < len; i++) {
                const face = simplexFaces[i];
        
                const ab = simplex[face.b].clone().sub(simplex[face.a]);
                const ac = simplex[face.c].clone().sub(simplex[face.a]);
                const norm = ab.cross(ac).normalize();
        
                const a0 = new THREE.Vector3().sub(simplex[face.a]);
                if (a0.dot(norm) > 0)
                    norm.negate();
        
                if (norm.clone().dot(extendPoint.clone().sub(simplex[face.a])) > 0)
                    removalFaces.push(i);
            }
        
            const edges = [];
            for (let i = 0, len = removalFaces.length; i < len; i++) {
                const face = simplexFaces[removalFaces[i]];
                const edgeAB = {a: face.a, b: face.b};
                const edgeAC = {a: face.a, b: face.c};
                const edgeBC = {a: face.b, b: face.c};
        
                let k = this.edgeInEdges(edges, edgeAB);
                if (k != -1)
                    edges.splice(k, 1);
                else
                    edges.push(edgeAB);
        
                k = this.edgeInEdges(edges, edgeAC);
                if (k != -1)
                    edges.splice(k, 1);
                else
                    edges.push(edgeAC);
        
                k = this.edgeInEdges(edges, edgeBC);
                if (k != -1)
                    edges.splice(k, 1);
                else
                    edges.push(edgeBC);
            }
        
            for (let i = removalFaces.length - 1; i >= 0; i--) {
                simplexFaces.splice(removalFaces[i], 1);
            }
        
            for (let i = 0, len = edges.length; i < len; i++) {
                simplexFaces.push({a: edges[i].a, b: edges[i].b, c: simplex.length - 1});
            }
        },
        edgeInEdges(edges, edge) {
            for (let i = 0, len = edges.length; i < len; i++)
                if (edges[i].a == edge.a && edges[i].b == edge.b)
                    return i;
        
            return -1;
        },
        findClosestFace(simplex, simplexFaces) {
            let closest = {dist: Infinity};
        
            for (let i = 0; i < simplexFaces.length; i++) {
                const face = simplexFaces[i];
        
                const ab = simplex[face.b].clone().sub(simplex[face.a]);
                const ac = simplex[face.c].clone().sub(simplex[face.a]);
                const norm = ab.cross(ac).normalize();
        
                const a0 = new THREE.Vector3().sub(simplex[face.a]);
                if (a0.dot(norm) > 0)
                    norm.negate();
        
                const dist = simplex[face.a].clone().dot(norm);
                /*const distA = simplex[face.a].clone().dot(norm);
                const distB = simplex[face.b].clone().dot(norm);
                const distC = simplex[face.c].clone().dot(norm);
                const dist = Math.min(distA, distB, distC); //is this necessary?*/
        
                if (dist < closest.dist)
                    closest = {index: i, dist: dist, norm: norm, a: face.a, b: face.b, c: face.c};
            }
        
            return closest;
        },
        EPA(aWorldVerts, bWorldVerts, simplex) {
            const simplexFaces = [{a: 0, b: 1, c: 2},
                                {a: 0, b: 1, c: 3},
                                {a: 0, b: 2, c: 3},
                                {a: 1, b: 2, c: 3}];
        
            const epsilon = 0.00001;
            let res = null;
        
            while(true) {
                const face = this.findClosestFace(simplex, simplexFaces);
                const point = this.support(aWorldVerts, bWorldVerts, face.norm);
                const dist = point.clone().dot(face.norm);
        
                if (dist - face.dist < epsilon) {
                    res = {dir: face.norm.negate(), dist: dist + epsilon};
                    break;
                }
        
                simplex.push(point);
                this.expand(simplex, simplexFaces, point);
            }
        
            return res;
        },
        GJK(colA, colB, initDir) {
            // really should preprocess this information for all objects but its fine for now
            const hullA = (new ConvexHull).setFromObject(colA.Object3D);
            const hullB = (new ConvexHull).setFromObject(colB.Object3D);

            const aWorldVerts = hullA.vertices;
            const bWorldVerts = hullB.vertices;

            let colliding = null;
            const simplex = [];
            const dir = initDir;

            simplex.push(this.support(aWorldVerts, bWorldVerts, dir));
            dir.negate();

            while(true) {
                const p = this.support(aWorldVerts, bWorldVerts, dir);
                simplex.push(p);

                if (p.clone().dot(dir) <= 0) {
                    colliding = false;
                    break;
                }

                if (this.evaluateAndChangeDir(simplex, dir)) {
                    colliding = true;
                    break;
                }
            }

            return colliding ? this.EPA(aWorldVerts, bWorldVerts, simplex) : null;
        },
        update() {
            const Collider = this.Collider;
            // update box3
            for (const entity in Collider) {
                Collider[entity].boundingBox.setFromObject(Collider[entity].Object3D);
            }

            const Object3D = this.Object3D;
            const colliders = Object.values(Collider);
            const len = colliders.length;
            for (let i = 0; i < len; i++) {
                for (let j = i + 1; j < len; j++) {
                    const colA = colliders[i];
                    const colB = colliders[j];
                    // broad phase (NEED TO ADD SPATIAL INDEX)
                    if (colA.boundingBox.intersectsBox(colB.boundingBox)) {
                        // narrow phase
                        const centerA = colA.boundingBox.getCenter(new THREE.Vector3());
                        const centerB = colB.boundingBox.getCenter(new THREE.Vector3());

                        // collision detection
                        const res = this.GJK(colA, colB, centerA.sub(centerB));

                        // collision response
                        if (res !== null) {
                            
                        }
                    }
                }
            }
        }
    },
    render: {
        init() {
            const config = System.config;

            document.getElementById('c').style.filter = 'brightness(' + (+config.brightness + 50)/100 + ')';

            if (config.displayMode === 'fullscreen') {
                document.body.requestFullscreen();
            }

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

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0080ff);
            this.scene = scene;

            this.camera = System.camera.perspectiveCamera;
        },
        update() {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

const Asset = {
    init: function() {
        const manager = new THREE.LoadingManager();
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

export {
    Asset,
    Entity,
    Component,
    System
};