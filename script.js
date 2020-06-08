import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

let scene, renderer, camera, controls, clock, dt;

let player;

const friction = 0.05,
	  walkingSpeed = 0.1;

const keyEnum = {};

class Object {
	constructor() {
		this.xVel = 0;
		this.yVel = 0;
		this.zVel = 0;
	}
}

class Player extends Object {
	constructor(controls) {
		super();
		this.controls = controls;

		const geo = new THREE.BoxGeometry( 10, 10, 10 );
		var mat = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
		var mesh = new THREE.Mesh( geo, mat );
		mesh.position.y = 5;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.add(camera);
		scene.add( mesh );
		this.mesh = mesh;
		// w s a d jump sprint
	}

	move() {
		const pos = this.mesh.position;
		const controls = this.controls;
		let xVel = this.xVel;
		let yVel = this.yVel;
		let zVel = this.zVel;

		if (Math.abs(xVel) < 0.1) {
			xVel = 0;
		}
		else if (xVel > 0)
			xVel -= friction;
		else if (xVel < 0)
			xVel += friction;

		if (Math.abs(xVel) < 2)	{
			if (keyEnum[controls[0]]) {
				xVel += walkingSpeed;
			}

			if (keyEnum[controls[1]]) {
				xVel -= walkingSpeed;
			}
		}


		if (Math.abs(zVel) < 0.1) {
			zVel = 0;
		}
		else if (zVel > 0)
			zVel -= friction;
		else if (zVel < 0)
			zVel += friction;

		if (Math.abs(zVel) < 2)	{
			if (keyEnum[controls[2]]) {
				zVel -= walkingSpeed;
			}

			if (keyEnum[controls[3]]) {
				zVel += walkingSpeed;
			}
		}

		pos.x += xVel;
		pos.y += yVel;
		pos.z += zVel;
		// camera.position.x = pos.x;
		// camera.position.y = pos.y;
		// camera.position.z = pos.z;
		this.mesh.position.set(pos.x, pos.y, pos.z);

		this.xVel = xVel;
		this.yVel = yVel;
		this.zVel = zVel;
	}

	update() {
		controls.target = this.mesh.position;
		this.move();
	}
}

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize, false );

function init() {
	//scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x0080ff );

	// camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 30, 30, 30 );

	controls = new OrbitControls( camera, document.getElementById("c") );

	// clock
	clock = new THREE.Clock();

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

	// renderer
	renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("c") });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
}

function create() {
	let geo, mat, mesh;

	//floor
	geo = new THREE.PlaneBufferGeometry( 2000, 2000 );
	mat = new THREE.MeshPhongMaterial( {color: 0x718E3E});
	mesh = new THREE.Mesh( geo, mat);
	mesh.position.y = 0;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	//player
	player = new Player(["w", "s", "a", "d", " "]);
}

function animate () {
	requestAnimationFrame( animate );

	dt = clock.getDelta();
	controls.update();

	player.update()

	renderer.render( scene, camera );
};

function main() {
	init();
	create();
	animate();
}

main();

document.addEventListener('keydown', function (event) {
	keyEnum[event.key.toLowerCase()] = true;
	// event.preventDefault();
});

document.addEventListener('keyup', function (event) {
	keyEnum[event.key.toLowerCase()] = false;
});

window.onblur = function (event) {
	for (var prop in keyEnum) {
	    if (Object.prototype.hasOwnProperty.call(keyEnum, prop)) {
	    	keyEnum[prop] = false
	    }
	}
};