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

	const renderer = app.renderer;
	const dom = renderer.domElement;
	renderer.setClearColor( 0xc4c4c4 );

	function render() {

		scene.add( gridHelper );
		renderer.update();
		scene.remove( gridHelper );

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

	orbit.addEventListener( 'change', render );

	const control = new TransformControls( camera, dom );

	control.addEventListener( 'change', render );
	control.addEventListener( 'dragging-changed', function ( event ) {

		orbit.enabled = ! event.value;

	} );

	control.attach( box );
	sceneHelper.add( control );

	dom.addEventListener( 'pointerdown', function ( event ) {

		const firstIntersect = getIntersects( event.clientX, event.clientY )[ 0 ];
		console.log( firstIntersect );

		if ( firstIntersect === undefined ) {

			control.enabled = false;
			control.detach();

		} else if ( control.object !== firstIntersect.object && control !== firstIntersect.object ) {

			control.enabled = true;
			control.attach( firstIntersect.object );

		}

		render();

	} );

	return {
		control, orbit, scene, render
	};

}
