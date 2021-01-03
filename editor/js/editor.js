import { Resizer } from './Resizer.js';
import { Toolbar } from './Toolbar.js';
import { Sidebar } from './Sidebar.js';
import { SidebarScene } from './Sidebar.Scene.js';

import * as TARO from '../../build/taro.js';
import { TransformControls } from './lib/TransformControls.js';
import { OrbitControls } from './lib/OrbitControls.js';

// editor stuff
const resizer = new Resizer();
const toolbar = new Toolbar();
const sidebar = new Sidebar();
const sidebarScene = new SidebarScene();


// taro stuff
const app = new TARO.Application( {
	canvas: 'canvas'
} );

const scene = new TARO.Scene();
app.setScene( scene );

//

const cameraEntity = new TARO.Entity();
const camera = cameraEntity.addComponent( 'PerspectiveCamera' );
cameraEntity.position.z = 5;

const box = new TARO.Entity();
box.addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );

const gridHelper = new TARO.GridHelper( 30, 30, 0x444, 0x9e9e9e );
scene.add( gridHelper );

//

const renderer = app.renderer;
renderer.setClearColor( 0xdadce0 );

// transform controls stuff

camera.position.set( 10, 10, 10 );
camera.lookAt( 0, 10, 0 );

const orbit = new OrbitControls( camera, renderer.domElement );
orbit.update();
orbit.addEventListener( 'change', () => {renderer.render()} );

const control = new TransformControls( camera, renderer.domElement );
control.addEventListener( 'change', () => {renderer.render()} );

control.addEventListener( 'dragging-changed', function ( event ) {

	orbit.enabled = ! event.value;

} );

console.log(camera)
control.attach( box );
scene.add( control );

//

window.addEventListener( 'keydown', function ( event ) {

	switch ( event.keyCode ) {

		case 81: // Q
			control.setSpace( control.space === 'local' ? 'world' : 'local' );
			break;

		case 16: // Shift
			control.setTranslationSnap( 100 );
			control.setRotationSnap( TARO.MathUtils.degToRad( 15 ) );
			control.setScaleSnap( 0.25 );
			break;

		case 87: // W
			control.setMode( 'translate' );
			break;

		case 69: // E
			control.setMode( 'rotate' );
			break;

		case 82: // R
			control.setMode( 'scale' );
			break;

		case 67: // C
			const position = camera.position.clone();

			camera = camera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
			camera.position.copy( position );

			orbit.object = camera;
			control.camera = camera;

			camera.lookAt( orbit.target.x, orbit.target.y, orbit.target.z );
			onWindowResize();
			break;

		case 86: // V
			const randomFoV = Math.random() + 0.1;
			const randomZoom = Math.random() + 0.1;

			cameraPersp.fov = randomFoV * 160;
			cameraOrtho.bottom = - randomFoV * 500;
			cameraOrtho.top = randomFoV * 500;

			cameraPersp.zoom = randomZoom * 5;
			cameraOrtho.zoom = randomZoom * 5;
			onWindowResize();
			break;

		case 187:
		case 107: // +, =, num+
			control.setSize( control.size + 0.1 );
			break;

		case 189:
		case 109: // -, _, num-
			control.setSize( Math.max( control.size - 0.1, 0.1 ) );
			break;

		case 88: // X
			control.showX = ! control.showX;
			break;

		case 89: // Y
			control.showY = ! control.showY;
			break;

		case 90: // Z
			control.showZ = ! control.showZ;
			break;

		case 32: // Spacebar
			control.enabled = ! control.enabled;
			break;

	}

} );

window.addEventListener( 'keyup', function ( event ) {

	switch ( event.keyCode ) {

		case 16: // Shift
			control.setTranslationSnap( null );
			control.setRotationSnap( null );
			control.setScaleSnap( null );
			break;

	}

} );
