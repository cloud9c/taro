import { TransformControls } from './lib/TransformControls.js';
import { OrbitControls } from './lib/OrbitControls.js';
import * as TARO from '../../build/taro.js';

export function Viewport( app ) {

	// taro stuff

	const scene = new TARO.Scene();
	app.setScene( scene );

	const camera = new TARO.PerspectiveCamera();

	const box = new TARO.Entity();
	box.addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );

	const gridHelper = new TARO.GridHelper( 30, 30, 0x444, 0x9e9e9e );
	scene.add( gridHelper );

	//

	const renderer = app.renderer;
	renderer.setClearColor( 0xc4c4c4 );

	function render() {
		renderer.render(scene, camera);
	}

	// transform controls stuff

	camera.position.set( 10, 10, 10 );
	camera.lookAt( 0, 200, 0 );

	const orbit = new OrbitControls( camera, renderer.domElement );
	orbit.update();

	orbit.addEventListener( 'change', render );

	const control = new TransformControls( camera, renderer.domElement );

	control.addEventListener( 'change', render );
	control.addEventListener( 'dragging-changed', function ( event ) {

		orbit.enabled = ! event.value;

	} );

	control.attach( box );
	scene.add( control );

	return {
		control, orbit, scene
	}

}
