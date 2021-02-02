import { TransformControls } from './lib/TransformControls.js';
import { OrbitControls } from './lib/OrbitControls.js';
import * as TARO from '../../build/taro.js';

export function Viewport( editor ) {

	let currentDrag;
	this.currentEntity = undefined;

	function onDragStart( event ) {

		currentDrag = this;
		event.dataTransfer.effectAllowed = 'move';

	}

	function onDragOver( event ) {

		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';

		if ( currentDrag === undefined || currentDrag === this ) return;

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

		if ( currentDrag !== undefined && currentDrag !== this ) {

			let element = this;
			while ( element.dataset.parent !== undefined ) {

				 if ( element.dataset.parent === currentDrag.dataset.id ) return this.classList.remove( 'drag-into', 'drag-above', 'drag-below' );

				element = document.querySelector( '#scene-tree [data-id="' + element.dataset.parent + '"]' );

			}

			if ( currentDrag.dataset.id === this.dataset.parent ) return;

			const currentObject = scene.getEntityById( parseInt( currentDrag.dataset.id ) );
			const thisObject = scene.getEntityById( parseInt( this.dataset.id ) );

			if ( currentDrag.dataset.parent !== undefined ) {

				const id = currentDrag.dataset.parent;
				delete currentDrag.dataset.parent;

				if ( document.querySelectorAll( '#scene-tree [data-parent="' + id + '"]' ).length === 0 ) {

					const parent = document.querySelector( '#scene-tree [data-id="' + id + '"]' );
					parent.classList.remove( 'parent' );
					delete parent.dataset.opened;

				}

			}

			if ( this.classList.contains( 'drag-above' ) || this.classList.contains( 'drag-below' ) ) {

				if ( currentDrag.style.paddingLeft !== '' || currentDrag.style.paddingLeft !== '24px' )
					currentDrag.style.paddingLeft = parseFloat( currentDrag.style.paddingLeft ) - 16 + 'px';

				if ( this.classList.contains( 'drag-above' ) )
					this.before( currentDrag );
				else
					this.after( currentDrag );

				if ( this.classList.contains( 'parent' ) && this.classList.contains( 'drag-below' ) ) {

					currentDrag.style.paddingLeft = parseFloat( window.getComputedStyle( this ).getPropertyValue( 'padding-left' ) ) + 16 + 'px';
					currentDrag.dataset.parent = this.dataset.id;
					thisObject.add( currentObject );

				} else if ( this.dataset.parent !== undefined ) {

					const parent = document.querySelector( '#scene-tree [data-id="' + this.dataset.parent + '"]' );
					currentDrag.dataset.parent = parent.dataset.id;
					currentDrag.style.paddingLeft = parseFloat( window.getComputedStyle( parent ).getPropertyValue( 'padding-left' ) ) + 16 + 'px';

				}

				thisObject.parent.add( currentObject );

			} else {

				const children = document.querySelectorAll( '#scene-tree [data-parent="' + this.dataset.id + '"]' );

				if ( children.length > 0 ) {

					editor.sidebarScene.openParent( this );
					children[ children.length - 1 ].after( currentDrag );

				} else {

					this.after( currentDrag );

				}

				this.classList.add( 'parent' );
				this.dataset.opened = '';
				currentDrag.style.paddingLeft = parseFloat( window.getComputedStyle( this ).getPropertyValue( 'padding-left' ) ) + 16 + 'px';
				currentDrag.dataset.parent = this.dataset.id;
				thisObject.add( currentObject );

			}

			const recursion = ( element ) => {

				const children = document.querySelectorAll( '#scene-tree [data-parent="' + element.dataset.id + '"]' );

				if ( children.length > 0 ) {

					let prevChild = element;
					const paddingLeft = parseFloat( window.getComputedStyle( element ).getPropertyValue( 'padding-left' ) );
					for ( let i = 0, len = children.length; i < len; i ++ ) {

						children[ i ].style.paddingLeft = paddingLeft + 16 + 'px';

						prevChild.after( children[ i ] );
						prevChild = children[ i ];

						recursion( children[ i ] );

					}

				}

			};

			recursion( currentDrag );

			render();

		}

		this.classList.remove( 'drag-into', 'drag-above', 'drag-below' );

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
		while ( scene.getEntityByName( name ) !== undefined ) {

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

	const grid = new TARO.GridHelper( 30, 30 );
	const color1 = new TARO.Color( 0x7d7d7d );
	const color2 = new TARO.Color( 0xDCDCDC );
	const attribute = grid.geometry.attributes.color;
	const array = attribute.array;
	for ( let i = 0; i < array.length; i += 12 ) {

		const color = ( i % ( 12 * 5 ) === 0 ) ? color1 : color2;

		for ( let j = 0; j < 12; j += 3 ) {

			color.toArray( array, i + j );

		}

	}

	attribute.needsUpdate = true;

	const boxHelper = new TARO.BoxHelper();
	boxHelper.material.depthTest = false;
	boxHelper.material.transparent = true;
	boxHelper.visible = false;

	const helpers = this.helpers = [ ];
	const icons = this.icons = [];

	scene.add( grid, boxHelper );

	const renderer = app.renderer;
	const dom = renderer.domElement;
	// renderer.observer.disconnect();
	renderer.setClearColor( 0xc4c4c4 );

	const DEFAULT_CAMERA = new TARO.PerspectiveCamera( 50, 1, 0.01, 1000 );
	const { width, height } = renderer.domElement.getBoundingClientRect();
	DEFAULT_CAMERA.aspect = width /	height;
	DEFAULT_CAMERA.updateProjectionMatrix();

	let camera = DEFAULT_CAMERA;

	const observer = new ResizeObserver( function () {

		const { width, height } = renderer.domElement.getBoundingClientRect();
		renderer.setSize( width, height, false );
		camera.aspect = width /	height;
		camera.updateProjectionMatrix();
		render();

	} );

	observer.observe( document.getElementById( 'canvas' ) );

	const render = this.render = () => {

		const deltaTime = app.time.update( performance.now() / 1000 );

		for ( const type in app._containers ) {

			const container = app._containers[ type ];
			if ( container[ 0 ] !== undefined && container[ 0 ].update !== undefined )
				for ( let j = 0, lenj = container.length; j < lenj; j ++ )
					container[ j ].update( deltaTime );

		}

		if ( this.currentEntity !== undefined ) {

			updateBoxHelper( this.currentEntity );

			for ( let i = 0, len = helpers.length; i < len; i ++ ) {

				helpers[ i ].update();

			}

		}

		renderer.render( scene, camera );

		renderer.autoClear = false;
		renderer.render( sceneHelper, camera );
		renderer.autoClear = true;

		app.input.update();

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

	control.addEventListener( 'change', function ( event ) {

		const section = document.getElementById( 'entity-section' );
		const entity = event.target.object;
		if ( section === null || entity === undefined ) return;
		const inputs = section.querySelectorAll( 'input[data-translation]' );

		for ( let i = 0, len = inputs.length; i < len; i ++ ) {

			const value = entity[ inputs[ i ].dataset.translation ][ inputs[ i ].dataset.xyz ];

			inputs[ i ].value = value.toFixed( 3 );

			if ( inputs[ i ].dataset.translation === 'rotation' ) inputs[ i ].value = TARO.MathUtils.radToDeg( value ).toFixed( 3 );

		}

		render();

	} );
	control.addEventListener( 'dragging-changed', function ( event ) {

		onControl = event.value;
		orbit.enabled = ! event.value;

	} );

	sceneHelper.add( control );

	const box = this.box = new TARO.Box3();

	const updateBoxHelper = this.updateBoxHelper = function ( entity ) {

		const temp = [];
		const children = entity.children;
		for ( let i = children.length - 1; i >= 0; i -- ) {

			if ( icons.includes( children[ i ] ) || children[ i ].isEntity === true ) {

				temp.push( children[ i ] );
				entity.remove( children[ i ] );

			}

		}

		box.setFromObject( entity );

		if ( box.isEmpty() ) {

			boxHelper.visible = false;

		} else {

			boxHelper.setFromObject( entity );
			boxHelper.visible = true;

		}

		for ( let i = 0, len = temp.length; i < len; i ++ ) {

			entity.add( temp[ i ] );

		}

	};

	const attach = this.attach = function ( entity ) {

		this.currentEntity = entity;
		control.enabled = true;
		editor.inspector.attach( entity );
		control.attach( entity );
		updateBoxHelper( entity );

	};

	function detach() {

		this.currentEntity = undefined;
		boxHelper.visible = false;
		editor.inspector.detach();
		control.enabled = false;
		control.detach();

	}

	let dragging = false;

	function onPointerUp( event ) {

		const intersects = getIntersects( event.clientX, event.clientY );
		let rayObject;

		for ( let i = 0, len = intersects.length; i < len; i ++ ) {

			rayObject = intersects[ i ].object;
			while ( rayObject.isEntity === undefined ) {

				if ( rayObject.parent === null ) {

					rayObject = undefined;
					break;

				}

				rayObject = rayObject.parent;

			}

			if ( rayObject !== undefined )
				break;

		}

		if ( ! ( onControl || dragging ) ) {

			const oldTarget = document.querySelector( '#scene-tree [data-selected]' );

			if ( rayObject === undefined ) {

				if ( oldTarget !== null ) delete oldTarget.dataset.selected;

				detach();

			} else if ( control.object !== rayObject && control !== rayObject ) {

				if ( oldTarget !== null ) delete oldTarget.dataset.selected;

				const newTarget = document.querySelector( '#scene-tree [data-id="' + rayObject.id + '"]' );
				if ( newTarget !== null ) newTarget.dataset.selected = '';

				attach( rayObject );

			}

			render();

		}

		dragging = false;

		dom.removeEventListener( 'pointerup', onPointerUp );

	}

	dom.addEventListener( 'pointerdown', function () {

		dom.addEventListener( 'pointerup', onPointerUp );

	} );

}
