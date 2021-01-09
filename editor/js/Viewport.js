import { TransformControls } from './lib/TransformControls.js';
import { OrbitControls } from './lib/OrbitControls.js';
import * as TARO from '../../build/taro.js';

export function Viewport( editor ) {

	let currentDrag;

	function onDragStart( event ) {

		currentDrag = this;

		event.dataTransfer.effectAllowed = 'move';

	}

	function onDragOver( event ) {

		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';

		if ( currentDrag === this ) return;

		const area = event.offsetY / this.clientHeight;

		if ( area < 0.25 ) {

			this.classList.add( 'drag-above' );
			this.classList.remove( 'drag-into', 'drag-below' );

		} else if ( area > 0.75 ) {

			this.classList.add( 'drag-below' );
			this.classList.remove( 'drag-into', 'drag-above' );

		} else {

			this.classList.add( 'drag-into' );
			this.classList.remove( 'drag-above', 'drag-below' );

		}

	}

	function onDrop( event ) {

		if ( currentDrag === this ) return;

		this.classList.remove( 'drag-into', 'drag-above', 'drag-below' );

		const currentObject = scene.findById( parseInt( currentDrag.dataset.id ) );
		const thisObject = scene.findById( parseInt( this.dataset.id ) );

		if ( this.classList.contains( 'drag-above' ) ) {

			thisObject.parent.add( currentObject );

			this.before( currentDrag );

		} else if ( this.classList.contains( 'drag-below' ) ) {

			thisObject.parent.add( currentObject );

			this.after( currentDrag );

		} else {

			this.after( currentDrag );

			this.classList.add( 'parent' );
			this.dataset.opened = '';
			currentDrag.style.marginLeft = parseFloat( window.getComputedStyle( this, null ).getPropertyValue( 'margin-left' ) ) + 16 + 'px';
			thisObject.add( currentObject );

		}

		event.preventDefault();

	}

	function onDragLeave( event ) {

		this.classList.remove( 'drag-into', 'drag-above', 'drag-below' );

	}

	const app = editor.app;

	const scene = this.scene = new TARO.Scene();
	const sceneHelper = new TARO.Scene();
	app.setScene( scene );

	this.addEntity = function ( name = 'Entity' ) {

		let counter = 1;
		while ( scene.find( name ) !== undefined ) {

			if ( counter > 1 )
				name = name.slice( 0, - ( 3 + Math.ceil( Math.log10( counter ) ) ) );

			name += ' (' + counter + ')';
			counter ++;

		}

		const entity = new TARO.Entity( name );
		const div = document.createElement( 'div' );

		div.innerText = name;
		div.dataset.id = entity.id;

		div.setAttribute( 'draggable', true );
		div.addEventListener( 'dragstart', onDragStart );
		div.addEventListener( 'dragover', onDragOver );
		div.addEventListener( 'drop', onDrop );
		div.addEventListener( 'dragleave', onDragLeave );

		document.getElementById( 'scene-tree' ).appendChild( div );

		return entity;

	};

	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );
	this.addEntity().addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshPhongMaterial( { color: 0x00ff00 } ) ) );

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

	const camera = new TARO.PerspectiveCamera();
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

	function getIntersects( x, y ) {

		var rect = dom.getBoundingClientRect();
		mouse.x = ( ( x - rect.left ) / rect.width ) * 2 - 1;
		mouse.y = - ( ( y - rect.top ) / rect.height ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( scene.children, true );

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
		let rayObject;

		if ( firstIntersect !== undefined ) {

			rayObject = firstIntersect.object;

			while ( rayObject.isEntity === undefined ) {

				rayObject = rayObject.parent;

			}

		}

		if ( ! ( onControl || dragging ) ) {

			const oldTarget = document.querySelector( '#scene-tree [data-selected]' );

			if ( firstIntersect === undefined ) {

				if ( oldTarget !== null ) delete oldTarget.dataset.selected;

				control.enabled = false;
				control.detach();

			} else if ( control.object !== rayObject && control !== rayObject ) {

				if ( oldTarget !== null ) delete oldTarget.dataset.selected;

				const newTarget = document.querySelector( '#scene-tree [data-id="' + rayObject.id + '"]' );
				if ( newTarget !== null ) newTarget.dataset.selected = '';

				control.enabled = true;
				control.attach( rayObject );

			}

			render();

		}

		dragging = false;

	} );

}
