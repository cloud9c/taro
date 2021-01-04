import { TransformControls } from './lib/TransformControls.js';
import { OrbitControls } from './lib/OrbitControls.js';
import * as TARO from '../../build/taro.js';

export function Viewport( app ) {

	// taro stuff

	const scene = new TARO.Scene();
	app.setScene( scene );

	const camera = new TARO.Entity().addComponent( 'PerspectiveCamera' );

	const box = new TARO.Entity();
	box.addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );

	const gridHelper = new TARO.GridHelper( 30, 30 );
	scene.add( gridHelper );

	const raycaster = new TARO.Raycaster();
	const mouse = new TARO.Vector2();

	const renderer = app.renderer;
	const dom = renderer.domElement;
	renderer.setClearColor( 0xc4c4c4 );

	function render() {

		renderer.update();

	}

	function getIntersects( x, y ) {

		var rect = dom.getBoundingClientRect();
		mouse.x = ( ( x - rect.left ) / rect.width ) * 2 - 1;
		mouse.y = - ( ( y - rect.top ) / rect.height ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( scene.children );

	}

	dom.addEventListener( 'pointerdown', function ( event ) {

		const intersects = getIntersects( event.clientX, event.clientY );
		console.log( intersects );

	} );

	// transform controls stuff

	camera.position.set( 10, 10, 10 );
	camera.lookAt( 0, 200, 0 );

	const orbit = new OrbitControls( camera, dom );
	orbit.update();

	orbit.addEventListener( 'change', render );

	const control = new TransformControls( camera, dom );

	control.addEventListener( 'change', render );
	control.addEventListener( 'dragging-changed', function ( event ) {

		orbit.enabled = ! event.value;

	} );

	control.attach( box );
	scene.add( control );

	dom.addEventListener( 'pointerdown', function () {

	} );

	return {
		control, orbit, scene, render
	};

}
