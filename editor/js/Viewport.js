import { TransformControls } from './lib/TransformControls.js';
import { OrbitControls } from './lib/OrbitControls.js';
import * as TARO from '../../build/taro.js';

export function Viewport( app ) {

	// taro stuff

	const scene = new TARO.Scene();
	const sceneHelper = new TARO.Scene();
	app.setScene( scene );

	const box = new TARO.Entity();
	box.addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );

	const grid = new TARO.GridHelper( 30, 30 );

	const renderer = app.renderer;
	const dom = renderer.domElement;
	renderer.setClearColor( 0xc4c4c4 );

	const camera = new TARO.Entity().addComponent( 'PerspectiveCamera' );
	const { width, height } = renderer.domElement.getBoundingClientRect();
	camera.aspect = width /	height;
	camera.updateProjectionMatrix();

	window.addEventListener( 'resize', function () {

		const { width, height } = renderer.domElement.getBoundingClientRect();
		camera.aspect = width /	height;
		camera.updateProjectionMatrix();
		render();

	} );

	function render() {

		scene.add( grid );
		renderer.render( scene, camera );
		scene.remove( grid );

		renderer.autoClear = false;
		renderer.render( sceneHelper, camera );
		renderer.autoClear = true;

	}

	const raycaster = new TARO.Raycaster();
	const mouse = new TARO.Vector2();
	const objects = [ box, box.children[ 0 ] ];

	function getIntersects( x, y ) {

		var rect = dom.getBoundingClientRect();
		mouse.x = ( ( x - rect.left ) / rect.width ) * 2 - 1;
		mouse.y = - ( ( y - rect.top ) / rect.height ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}

	// transform controls stuff

	camera.position.set( 10, 10, 10 );
	camera.lookAt( 0, 200, 0 );

	const orbit = new OrbitControls( camera, dom );
	orbit.update();

	orbit.addEventListener( 'change', function ( event ) {

		dragging = true;
		render();

	} );

	const control = new TransformControls( camera, dom );
	let onControl = false;

	control.addEventListener( 'change', render );
	control.addEventListener( 'dragging-changed', function ( event ) {

		onControl = event.value;
		orbit.enabled = ! event.value;

	} );

	// control.attach( box );
	sceneHelper.add( control );

	let dragging = false;

	dom.addEventListener( 'pointerup', function ( event ) {

		const firstIntersect = getIntersects( event.clientX, event.clientY )[ 0 ];

		if ( ! ( onControl || dragging ) ) {

			if ( firstIntersect === undefined ) {

				control.enabled = false;
				control.detach();

			} else if ( control.object !== firstIntersect.object && control !== firstIntersect.object ) {

				control.enabled = true;
				control.attach( firstIntersect.object );

			}

			render();

		}

		dragging = false;

	} );

	return {
		control, orbit, scene, render
	};

}
