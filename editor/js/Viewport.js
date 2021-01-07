import { TransformControls } from './lib/TransformControls.js';
import { OrbitControls } from './lib/OrbitControls.js';
import * as TARO from '../../build/taro.js';

export function Viewport( editor ) {

	this.addEntity = function ( name = 'Entity' ) {

		const entity = new TARO.Entity( name );

		const div = document.createElement( 'div' );
		div.innerText = 'Entity';
		div.dataset.uuid = entity.uuid;
		document.getElementById( 'scene-tree' ).appendChild( div );

		return entity;

	};

	const app = editor.app;

	const scene = this.scene = new TARO.Scene();
	const sceneHelper = new TARO.Scene();
	app.setScene( scene );

	const box = this.addEntity();
	box.addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );

	const grid = new TARO.GridHelper( 30, 30 );

	const color1 = new TARO.Color( 0x7d7d7d );
	const color2 = new TARO.Color( 0xDCDCDC );

	const attribute = grid.geometry.attributes.color;
	const array = attribute.array;

	for ( var i = 0; i < array.length; i += 12 ) {

		const color = ( i % ( 12 * 5 ) === 0 ) ? color1 : color2;

		for ( var j = 0; j < 12; j += 3 ) {

			color.toArray( array, i + j );

		}

	}

	attribute.needsUpdate = true;

	const renderer = app.renderer;
	const dom = renderer.domElement;
	renderer.observer.disconnect();
	renderer.setClearColor( 0xc4c4c4 );

	const camera = new TARO.Entity().addComponent( 'PerspectiveCamera' );
	const { width, height } = renderer.domElement.getBoundingClientRect();
	camera.aspect = width /	height;
	camera.updateProjectionMatrix();

	window.addEventListener( 'resize', function () {

		const { width, height } = renderer.domElement.getBoundingClientRect();
		renderer.setSize( width, height, false );
		camera.aspect = width /	height;
		camera.updateProjectionMatrix();
		render();

	} );

	const render = this.render = function () {

		scene.add( grid );
		renderer.render( scene, camera );
		scene.remove( grid );

		renderer.autoClear = false;
		renderer.render( sceneHelper, camera );
		renderer.autoClear = true;

	};

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

	const orbit = this.orbit = new OrbitControls( camera, dom );
	orbit.update();

	orbit.addEventListener( 'change', function ( event ) {

		dragging = true;
		render();

	} );

	const control = this.control = new TransformControls( camera, dom );
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
		const rayObject = firstIntersect.object;

		while ( rayObject.isEntity === undefined ) {

		}

		if ( ! ( onControl || dragging ) ) {

			if ( firstIntersect === undefined ) {

				control.enabled = false;
				control.detach();

			} else if ( control.object !== rayObject && control !== rayObject ) {

				const oldTarget = document.querySelector( '#scene-tree [data-selected]' );

				if ( oldTarget !== null ) delete oldTarget.dataset.selected;

				const newTarget = document.querySelector( '#scene-tree [data-uuid="' + rayObject.uuid + '"]' );
				console.log( 'data-uuid="' + rayObject.uuid + '"' );
				if ( newTarget !== null ) newTarget.dataset.selected = '';

				console.log( newTarget );

				control.enabled = true;
				control.attach( rayObject );

			}

			render();

		}

		dragging = false;

	} );

}
