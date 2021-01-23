import { TextureLoader } from '../../build/taro.js';
import * as TARO from '../../build/taro.js';

export function SidebarScene( editor ) {

	const inspector = editor.sidebarInspector;
	const viewport = editor.viewport;
	const renderer = editor.app.renderer;
	const render = editor.render;

	const scene = viewport.scene;
	const textureLoader = new TextureLoader();

	let colorBackground = new TARO.Color();
	let textureBackground, textureEquirect, environmentTexture;
	const fog = new TARO.Fog();
	const fogExp2 = new TARO.FogExp2();

	function processFile( files, target ) {

		if ( files.length === 0 ) return;

		const canvas = target.getElementsByClassName( 'file-display' )[ 0 ];
		const context = canvas.getContext( '2d' );
		const reader = new FileReader();

		reader.onload = () => {

			textureLoader.load( reader.result, function ( texture ) {

				const image = texture.image;
				const scale = canvas.width / image.width;

				context.fillStyle = '#fff';
				context.fillRect( 0, 0, canvas.width, canvas.height );
				context.drawImage( image, canvas.width / 2 - image.width * scale / 2,
					canvas.height / 2 - image.height * scale / 2, image.width * scale, image.height * scale );

				switch ( target.id ) {

					case 'background-texture':
						textureBackground = texture;
						onTextureOption();
						break;
					case 'background-equirect':
						textureEquirect = new TARO.WebGLCubeRenderTarget( image.height );
						textureEquirect.fromEquirectangularTexture( renderer, texture );
						onEquirectOption();
						break;
					case 'environment-texture':
						environmentTexture = texture;
						onEnvironmentOption();

				}

			} );

		};

		reader.readAsDataURL( files[ 0 ] );

	}

	function onChange() {

		processFile( this.files, this.parentElement );

	}

	function onFileDown( event ) {

		if ( event.isPrimary === false ) return;

		event.target.querySelector( 'input' ).click();

	}

	function onDragEnter( event ) {

		event.stopPropagation();
		event.preventDefault();

	}

	function onDrop( event ) {

		event.stopPropagation();
		event.preventDefault();

		processFile( event.dataTransfer.files, event.target );

	}

	const dropboxes = document.querySelectorAll( '#scene .file-wrapper' );
	const hiddenInputs = document.querySelectorAll( '#scene .hidden-input' );

	for ( let i = 0, len = dropboxes.length; i < len; i ++ ) {

		hiddenInputs[ i ].addEventListener( 'change', onChange, false );
		dropboxes[ i ].addEventListener( 'pointerdown', onFileDown, false );
		dropboxes[ i ].addEventListener( 'dragenter', onDragEnter, false );
		dropboxes[ i ].addEventListener( 'dragover', onDragEnter, false );
		dropboxes[ i ].addEventListener( 'drop', onDrop, false );

	}

	function resetBackgroundInput() {

		document.getElementById( 'background-color' ).style.removeProperty( 'display' );
		document.getElementById( 'background-texture' ).style.removeProperty( 'display' );
		document.getElementById( 'background-equirect' ).style.removeProperty( 'display' );

	}

	function onColorOption() {

		colorBackground.set( document.getElementById( 'background-color' ).value );
		scene.background = colorBackground;
		render();

	}

	function onTextureOption() {

		if ( textureBackground !== undefined ) {

			scene.background = textureBackground;
			render();

		}

	}

	function onEquirectOption() {

		if ( textureEquirect !== undefined ) {

			scene.background = textureEquirect;
			render();

		}

	}

	document.getElementById( 'background-color' ).addEventListener( 'input', onColorOption );

	document.getElementById( 'background' ).addEventListener( 'change', function ( event ) {

		resetBackgroundInput();

		switch ( event.target.value ) {

			case 'none':
				scene.background = null;
				this.style.removeProperty( 'min-width' );
				render();
				break;
			case 'color':
				document.getElementById( 'background-color' ).style.setProperty( 'display', 'inherit' );
				onColorOption( event.target );
				this.style.setProperty( 'min-width', '90px' );
				break;
			case 'texture':
				document.getElementById( 'background-texture' ).style.setProperty( 'display', 'inherit' );
				onTextureOption();
				this.style.setProperty( 'min-width', '90px' );
				break;
			case 'equirect':
				document.getElementById( 'background-equirect' ).style.setProperty( 'display', 'inherit' );
				onEquirectOption();
				this.style.setProperty( 'min-width', '90px' );

		}

	} );

	function onEnvironmentOption() {

		if ( environmentTexture !== undefined ) {

			scene.environment = environmentTexture;
			render();

		}

	}

	document.getElementById( 'environment' ).addEventListener( 'change', function ( event ) {

		switch ( event.target.value ) {

			case 'none':
				document.getElementById( 'environment-texture' ).style.removeProperty( 'display' );
				scene.environment = null;
				render();
				this.style.removeProperty( 'min-width' );
				break;
			case 'texture':
				document.getElementById( 'environment-texture' ).style.setProperty( 'display', 'inherit' );
				onEnvironmentOption();
				this.style.setProperty( 'min-width', '90px' );
				break;

		}

	} );

	const fogOptions = document.querySelectorAll( '#fog-options input' );
	const linearFog = document.getElementById( 'linear-fog' ).children;
	const expFog = document.getElementById( 'exponential-fog' ).children;
	const linearColor = document.getElementById( 'color-linear-fog' );
	const expColor = document.getElementById( 'color-exp-fog' );

	function resetFogInput() {

		document.getElementById( 'linear-fog' ).style.removeProperty( 'display' );
		linearColor.style.removeProperty( 'display' );
		document.getElementById( 'exponential-fog' ).style.removeProperty( 'display' );
		expColor.style.removeProperty( 'display' );

	}

	document.getElementById( 'fog' ).addEventListener( 'change', function ( event ) {

		resetFogInput();

		switch ( event.target.value ) {

			case 'none':
				scene.fog = null;
				this.style.removeProperty( 'min-width' );
				render();
				break;
			case 'linear':
				document.getElementById( 'linear-fog' ).style.setProperty( 'display', 'flex' );
				this.style.setProperty( 'min-width', '90px' );
				linearColor.style.setProperty( 'display', 'inherit' );
				setFog();
				break;
			case 'exponential':
				document.getElementById( 'exponential-fog' ).style.setProperty( 'display', 'flex' );
				this.style.setProperty( 'min-width', '90px' );
				expColor.style.setProperty( 'display', 'inherit' );
				setExpFog();
				break;

		}

	} );

	function setFog() {

		console.log( 'here' );
		fog.color.set( linearColor.value );
		fog.near = parseFloat( linearFog[ 0 ].value );
		fog.far = parseFloat( linearFog[ 1 ].value );

		scene.fog = fog;
		render();

	}

	function setExpFog() {

		fogExp2.color.set( expColor.value );
		fogExp2.density = parseFloat( expFog[ 0 ].value );

		scene.fog = fogExp2;
		render();

	}

	linearColor.addEventListener( 'input', setFog );
	expColor.addEventListener( 'input', setExpFog );
	linearFog[ 0 ].addEventListener( 'input', setFog );
	linearFog[ 1 ].addEventListener( 'input', setFog );
	expFog[ 0 ].addEventListener( 'input', setExpFog );

	function closeParent( target ) {

		const recursion = ( children ) => {

			for ( let i = 0, len = children.length; i < len; i ++ ) {

				children[ i ].style.setProperty( 'display', 'none' );

				const grandChildren = document.querySelectorAll( '#scene-tree [data-parent="' + children[ i ].dataset.id + '"]' );

				if ( grandChildren.length > 0 ) {

					recursion( grandChildren );

				}

			}

		};

		recursion( document.querySelectorAll( '#scene-tree [data-parent="' + target.dataset.id + '"]' ) );

		delete target.dataset.opened;

	}

	this.closeParent = closeParent;

	function openParent( target ) {

		const recursion = ( children ) => {

			for ( let i = 0, len = children.length; i < len; i ++ ) {

				children[ i ].style.removeProperty( 'display' );

				if ( children[ i ].dataset.opened !== undefined ) {

					const grandChildren = document.querySelectorAll( '#scene-tree [data-parent="' + children[ i ].dataset.id + '"]' );

					if ( grandChildren.length > 0 ) {

						recursion( grandChildren );

					}

				}

			}

		};

		recursion( document.querySelectorAll( '#scene-tree [data-parent="' + target.dataset.id + '"]' ) );

		target.dataset.opened = '';

	}

	this.openParent = openParent;

	document.getElementById( 'scene-tree' ).addEventListener( 'pointerup', function ( event ) {

		const target = event.target;

		if ( event.isPrimary === true && target.tagName !== 'SECTION' ) {

			if ( target.classList.contains( 'parent' ) && event.clientX - target.getBoundingClientRect().left < parseFloat( window.getComputedStyle( target ).getPropertyValue( 'padding-left' ) ) ) {

				if ( target.dataset.opened !== undefined ) closeParent( target );
				else openParent( target );

			} else {

				const oldTarget = document.querySelector( '#scene-tree [data-selected]' );
				if ( oldTarget === target ) return;
				if ( oldTarget !== null ) delete oldTarget.dataset.selected;
				target.dataset.selected = '';

				const entity = scene.getEntityById( parseInt( target.dataset.id ) );

				viewport.control.enabled = true;
				inspector.attach( entity );
				viewport.control.attach( entity );

				editor.render();

			}

		}

	} );

}
