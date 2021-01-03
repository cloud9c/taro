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

const camera = new TARO.Entity();
camera.addComponent( 'PerspectiveCamera' );
camera.position.z = 5;

const box = new TARO.Entity();
box.addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshBasicMaterial( { color: 0x00ff00 } ) ) );

app.renderer.setClearColor( 0xaaaaaa );

app.update();

// transform controls stuff
let cameraPersp, cameraOrtho, currentCamera;
let renderer, control, orbit;

init();

function init() {

	renderer = app.renderer;
	document.body.appendChild( renderer.domElement );

	const aspect = window.innerWidth / window.innerHeight;

	cameraPersp = new TARO.PerspectiveCamera( 50, aspect, 0.01, 30000 );
	cameraOrtho = new TARO.OrthographicCamera( - 600 * aspect, 600 * aspect, 600, - 600, 0.01, 30000 );
	currentCamera = cameraPersp;

	currentCamera.position.set( 100, 50, 100 );
	currentCamera.lookAt( 0, 200, 0 );

	orbit = new OrbitControls( currentCamera, renderer.domElement );
	orbit.update();
	orbit.addEventListener( 'change', () => {

		app.update();

	} );

	control = new TransformControls( currentCamera, renderer.domElement );
	control.addEventListener( 'change', () => {

		app.update();

	} );

	control.addEventListener( 'dragging-changed', function ( event ) {

		orbit.enabled = ! event.value;

	} );

	control.attach( box );
	scene.add( control );

	window.addEventListener( 'resize', onWindowResize, false );

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
				const position = currentCamera.position.clone();

				currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
				currentCamera.position.copy( position );

				orbit.object = currentCamera;
				control.camera = currentCamera;

				currentCamera.lookAt( orbit.target.x, orbit.target.y, orbit.target.z );
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

}
