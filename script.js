import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

let scene, renderer, camera, controls;

let player, player2, bot1, bot2, ball, objects;

let roundStarted = false;

const keyEnum = {},
	  colors = [0x0088FF, 0xFF7700, 0xFF0033, 0x9911AA, 0xAADD22];

const ground = 10,
	speed = 0.2,
	friction = 0.1,
	stopSpeed = 0.05,
	jumpHeight = 3,
	gravity = 0.2,
	ballGravity = 0.15,
	ballRadius = 3.3,
	personRadius = 7.243721961975098,
	smashMultiplier = 2,
	ballResistance = 0.7;

class Object {
	constructor() {
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.zVelocity = 0;
	}
}

class Person extends Object {
	constructor(controls, pos) {
		super();

		this.parts = [];
		this.controls = controls;
		this.newX = 0;
		this.newY = 0;
		this.newZ = 0;

		let points = [];
		for ( let deg = 0; deg <= 180; deg += 1 ) {
			const rad = Math.PI * deg / 180;
			const point = new THREE.Vector2( ( 0.72 + .08 * Math.cos( rad ) ) * Math.sin( rad ), - Math.cos( rad ) );
			points.push( point );
		}

		const geo = new THREE.LatheBufferGeometry( points, 32 );
		geo.scale(10, 10, 10);
		const mat = new THREE.MeshPhongMaterial( {color: colors.splice(Math.floor(Math.random()*colors.length), 1)[0]} );
		const mesh = new THREE.Mesh( geo, mat );
		mesh.position.set(pos[0], 10, pos[1]);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.geometry.computeBoundingBox();
		this.parts.push( mesh );
		scene.add( mesh )
	}

	move() {
		const pos = this.parts[0].position;
		const controls = this.controls;
		let xVelocity = this.xVelocity;
		let yVelocity = this.yVelocity;
		let zVelocity = this.zVelocity;
		
		if (Math.abs(xVelocity) < 1) {
			if (keyEnum[controls[1]]) {
				xVelocity += speed;
			}

			if (keyEnum[controls[0]]) {
				xVelocity -= speed;
			}
		}

		if (xVelocity > 0) {
			xVelocity -= friction;
			if (xVelocity < stopSpeed) {
				xVelocity = 0
			}
		} else if (xVelocity < 0) {
			xVelocity += friction;
			if (xVelocity > stopSpeed) {
				xVelocity = 0
			}
		}

		if (Math.abs(zVelocity) < 1) {
			if (keyEnum[controls[2]]) {
				zVelocity += speed;
			}

			if (keyEnum[controls[3]]) {
				zVelocity -= speed;
			}
		}

		if (zVelocity > 0) {
			zVelocity -= friction;
			if (zVelocity < stopSpeed) {
				zVelocity = 0
			}
		} else if (zVelocity < 0) {
			zVelocity += friction;
			if (zVelocity > stopSpeed) {
				zVelocity = 0
			}
		}

		if (keyEnum[controls[4]] && pos.y == 10) {
			yVelocity += jumpHeight;
		}


		for (let i = 0; i < this.parts.length; i++) {
			let newX = pos.x + xVelocity;
			let newY = pos.y + yVelocity;
			let newZ = pos.z + zVelocity;
			this.newX = newX;
			this.newY = newY;
			this.newZ = newZ;
			const part = this.parts[i].position;
			const teammate = this.teammate;

			if (newY < ground) {
				part.y = ground;
				yVelocity = 0;
			} else {
				part.y = newY;
				yVelocity -= gravity;
			}

			if (newX - personRadius <= teammate.newX + personRadius && newX + personRadius >= teammate.newX - personRadius
				&& newZ - personRadius <= teammate.newZ + personRadius && newZ + personRadius >= teammate.newZ - personRadius) {
				newX += -6 * xVelocity;
				newZ += -6 * zVelocity;

				camera.position.x -= 1.5 * xVelocity;
				camera.position.z -= 1.5 * zVelocity;

	        }

			if (newX - personRadius < 0) {
				part.x = personRadius;
				xVelocity = 0;
			} else if (newX + personRadius > 150) {
				part.x = 150 - personRadius;
				xVelocity = 0;
			} else {
				part.x = newX;
				camera.position.x += xVelocity/4;
			}

			if (newZ - personRadius < -70) {
				part.z = -70 + personRadius;
				xVelocity = 0;
			} else if (newZ + personRadius > 70) {
				part.z = 70 - personRadius;
				xVelocity = 0;
			} else {
				part.z = newZ;
				camera.position.z += zVelocity/4;
			}
		}

		this.xVelocity = xVelocity;
		this.yVelocity = yVelocity;
		this.zVelocity = zVelocity;
	}

	update() {
		this.move();
	}
}

class Bot extends Person {
	constructor(controls, pos) {
		super(controls, pos);
		this.target = false;
	}

	think() {
		const controls = this.controls;
		const pos = this.parts[0].position;
		const target = this.target;
		// w, s, a, d, jump

		if (!target) {
			if (roundStarted) {

			} else {
				this.target = [pos.x, pos.y, pos.z - 20];
			}
		} else {
			if (target[0] - pos.x < 0) {
				controls[0] = true;
			} else {
				controls[1] = true;
			}

			if (target[1] - pos.y < 0) {
				controls[4] = true;
			} else {
				controls[4] = false;
			}

			if (target[2] - pos.z < 0) {
				controls[2] = true;
			} else {
				controls[3] = true;
			}

		}

		this.controls = controls;
	}

	move() {
		const pos = this.parts[0].position;
		const controls = this.controls;
		let xVelocity = this.xVelocity;
		let yVelocity = this.yVelocity;
		let zVelocity = this.zVelocity;
		
		if (Math.abs(xVelocity) < 1) {
			if (controls[1]) {
				xVelocity += speed;
			}

			if (controls[0]) {
				xVelocity -= speed;
			}
		}

		if (xVelocity > 0) {
			xVelocity -= friction;
			if (xVelocity < stopSpeed) {
				xVelocity = 0
			}
		} else if (xVelocity < 0) {
			xVelocity += friction;
			if (xVelocity > stopSpeed) {
				xVelocity = 0
			}
		}

		if (Math.abs(zVelocity) < 1) {
			if (controls[2]) {
				zVelocity += speed;
			}

			if (controls[3]) {
				zVelocity -= speed;
			}
		}

		if (zVelocity > 0) {
			zVelocity -= friction;
			if (zVelocity < stopSpeed) {
				zVelocity = 0
			}
		} else if (zVelocity < 0) {
			zVelocity += friction;
			if (zVelocity > stopSpeed) {
				zVelocity = 0
			}
		}

		if (controls[4] && pos.y == 10) {
			yVelocity += jumpHeight;
		}


		for (let i = 0; i < this.parts.length; i++) {
			let newX = pos.x + xVelocity;
			let newY = pos.y + yVelocity;
			let newZ = pos.z + zVelocity;
			this.newX = newX;
			this.newY = newY;
			this.newZ = newZ;
			const part = this.parts[i].position;
			const teammate = this.teammate;

			if (newY < ground) {
				part.y = ground;
				yVelocity = 0;
			} else {
				part.y = newY;
				yVelocity -= gravity;
			}

			if (newX - personRadius <= teammate.newX + personRadius && newX + personRadius >= teammate.newX - personRadius
				&& newZ - personRadius <= teammate.newZ + personRadius && newZ + personRadius >= teammate.newZ - personRadius) {
				newX += -6 * xVelocity;
				newZ += -6 * zVelocity;

				camera.position.x -= 1.5 * xVelocity;
				camera.position.z -= 1.5 * zVelocity;

	        }

			if (newX - personRadius > 0) {
				part.x = personRadius;
				xVelocity = 0;
			} else if (newX + personRadius < -150) {
				part.x = 150 - personRadius;
				xVelocity = 0;
			} else {
				part.x = newX;
				camera.position.x += xVelocity/4;
			}

			if (newZ - personRadius < -70) {
				part.z = -70 + personRadius;
				xVelocity = 0;
			} else if (newZ + personRadius > 70) {
				part.z = 70 - personRadius;
				xVelocity = 0;
			} else {
				part.z = newZ;
				camera.position.z += zVelocity/4;
			}
		}

		this.xVelocity = xVelocity;
		this.yVelocity = yVelocity;
		this.zVelocity = zVelocity;
	}

	update() {
		this.think();
		this.move();
	}
}

class Ball extends Object {
	constructor() {
		super();

		const geo = new THREE.SphereBufferGeometry( ballRadius, 32, 32 );
		const mat = new THREE.MeshPhongMaterial({ color: 0xFFAA00 });
		const ball = new THREE.Mesh( geo, mat );
		ball.position.set(90, 25, 0);
		ball.receiveShadow = true;
		ball.castShadow = true;
		scene.add( ball );

		this.ball = ball;
	}

	checkCollision() {
		const ball = this.ball;

		const ballX = ball.position.x;
		const ballY = ball.position.y;
		const ballZ = ball.position.z;

		for (let i = 1; i < objects.length; i++) {

			const x = Math.max(objects[i].newX - personRadius, Math.min(ballX, objects[i].newX + personRadius));
			const y = Math.max(objects[i].newY - personRadius, Math.min(ballY, objects[i].newY + personRadius));
			const z = Math.max(objects[i].newZ - personRadius, Math.min(ballZ, objects[i].newZ + personRadius));

			const distance = Math.sqrt((x - ballX) * (x - ballX) + (y - ballY) * (y - ballY) + (z - ballZ) * (z - ballZ));

			if (distance < ballRadius) {
				if (!roundStarted) {
					roundStarted = true;
				}

				this.xVelocity = this.xVelocity * ballResistance + objects[i].xVelocity;
				this.yVelocity = this.yVelocity * ballResistance + objects[i].yVelocity;
				this.zVelocity = this.zVelocity * ballResistance + objects[i].zVelocity;

				if (keyEnum[objects[i].controls[4]]) {
					this.xVelocity *= smashMultiplier;
					this.yVelocity *= smashMultiplier/2;
					this.zVelocity *= smashMultiplier;
				}

				console.log("here")
			}
		}
	}

	move() {
		let xVelocity = this.xVelocity;
		let yVelocity = this.yVelocity;
		let zVelocity = this.zVelocity;

		const pos = this.ball.position;
		const newX = pos.x + xVelocity;
		const newY = pos.y + yVelocity;
		const newZ = pos.z + zVelocity;

		pos.x = newX;
		pos.z = newZ;

		camera.position.x += xVelocity/4;
		camera.position.z += zVelocity/4;

		if (newY < ballRadius) {
			xVelocity *= ballResistance;
			yVelocity *= -ballResistance;
			zVelocity *= ballResistance;
			// xVelocity = 0;
			// yVelocity = 0;
			// zVelocity = 0;
			// this.ball.position.set(90, 20, 0);
			// roundStarted = false;
			// pos.y = ballRadius;
		} else {
			pos.y = newY;
			if (roundStarted)
				yVelocity -= ballGravity;
		}

		this.xVelocity = xVelocity;
		this.yVelocity = yVelocity;
		this.zVelocity = zVelocity;
	}

	update() {
		this.checkCollision()
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
	camera.position.set( 175, 125, 75 );

	// orbit control
	controls = new OrbitControls( camera, document.getElementById("c") );
	controls.enableKeys = false;
	controls.maxPolarAngle = Math.PI * 0.4;
	controls.minDistance = 100;
	controls.maxDistance = 500;

	// lighting
	scene.add( new THREE.AmbientLight( 0x666666 ) );

	const light = new THREE.DirectionalLight( 0xdfebff, 0.6 );
	light.position.set( 0, 200, 0 );
	light.position.multiplyScalar( 1.3 );

	light.castShadow = true;

	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;

	const d = 300;

	light.shadow.camera.left = - d;
	light.shadow.camera.right = d;
	light.shadow.camera.top = d;
	light.shadow.camera.bottom = - d;

	light.shadow.camera.far = 1000;

	scene.add( light );

	// renderer
	renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("c") });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
}

function create() {
	let geo, mat, mesh, texture, loader;

	//floor
	geo = new THREE.PlaneBufferGeometry( 180, 90 );
	mat = new THREE.MeshPhongMaterial( {color: 0xE19B4E});
	mesh = new THREE.Mesh( geo, mat);
	mesh.position.y = 0;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	//free zone
	geo = new THREE.PlaneBufferGeometry( 300, 140 );
	mat = new THREE.MeshPhongMaterial( {color: 0x61995E});
	mesh = new THREE.Mesh( geo, mat);
	mesh.position.y = -0.1;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	//lines
	const linePos = [[180, 0, 44.75, false], [180, 0, -44.75, false], [90, -89.75, 0, true], [90, 89.75, 0, true], [90, 29.75, 0, true], [90, -29.75, 0, true], [90, 0, 0, true]];
	for (let i = 0; i < linePos.length; i++) {
		geo = new THREE.PlaneBufferGeometry( linePos[i][0], 0.5 );
		mat = new THREE.MeshPhongMaterial( {color: 0xffffff});
		mesh = new THREE.Mesh( geo, mat);
		mesh.position.set(linePos[i][1], 0.1, linePos[i][2]);
		mesh.rotation.x = - Math.PI / 2;
		if (linePos[i][3])
			mesh.rotation.z = Math.PI / 2;
		mesh.receiveShadow = true;
		scene.add( mesh );
	}

	//poles
	const polePos = [54.1, -54.1];
	for (let i = 0; i < 2; i++) {
		geo = new THREE.CylinderBufferGeometry( 1, 1, 24.3, 8 );
		mat = new THREE.MeshPhongMaterial( {color: 0xA9A9A9} );
		mesh = new THREE.Mesh( geo, mat );
		mesh.position.set(0, 12.15, polePos[i]);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		scene.add( mesh );
	}

	//net
	texture = new THREE.TextureLoader().load( 'assets/net.png' );
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 10, 1 );
	geo = new THREE.PlaneBufferGeometry( 100, 10 );
	mat = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true});
	mesh = new THREE.Mesh( geo, mat);
	mesh.position.y = 19.3;
	mesh.rotation.y = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	//players
	player = new Person(["w", "s", "a", "d", " "], [20, 20]);
	player2 = new Person(["arrowup", "arrowdown", "arrowleft", "arrowright", "shift"], [20, -20]);
	player.teammate = player2;
	player2.teammate = player;

	bot1 = new Bot([false, false, false, false, false], [-20, 20]);
	bot2 = new Bot([false, false, false, false, false], [-20, -20]);
	bot1.teammate = bot2;
	bot2.teammate = bot1;

	//ball
	ball = new Ball();

	objects = [ball, player, player2, bot1, bot2];
}

function animate () {
	requestAnimationFrame( animate );

	for (let i = 0; i < objects.length; i++) {
		objects[i].update();
	}

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