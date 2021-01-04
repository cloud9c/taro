import { TextureLoader } from '../../build/taro.js';
import * as TARO from '../../build/taro.js';

export function SidebarScene( scene, renderer, render ) {

	const textureLoader = new TextureLoader();

	let colorBackground = '#000000';
	let textureBackground;
	let textureEquirect;

	function processFile( files, target ) {

		if ( files.length === 0 ) return;

		const canvas = target.getElementsByClassName( 'file-display' )[ 0 ];
		const ctx = canvas.getContext( '2d' );
		const { width, height } = canvas.getBoundingClientRect();
		const reader = new FileReader();

		reader.onload = () => {

			textureLoader.load( reader.result, function ( texture ) {

				ctx.drawImage( texture.image, width, height );
				ctx.clearRect( 0, 0, width, height );

				switch ( target.id ) {

					case 'background-texture':
						textureBackground = texture;
						onTextureOption();
						break;
					case 'background-equirect':
						textureEquirect = new TARO.WebGLCubeRenderTarget( texture.image.height );
						textureEquirect.fromEquirectangularTexture( renderer, texture );
						onEquirectOption();

				}

			} );

		};

		reader.readAsDataURL( files[ 0 ] );

	}

	function onChange() {

		processFile( this.files, this.parentElement );

	}

	function onFileDown( event ) {

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

	const dropboxes = document.getElementsByClassName( 'file-wrapper' );
	const hiddenInputs = document.getElementsByClassName( 'hidden-input' );

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

		scene.background = new TARO.Color( document.getElementById( 'background-color' ).value );
		render();

	}

	function onTextureOption() {

		if ( textureBackground !== undefined )
			scene.background = textureBackground;
		render();

	}

	function onEquirectOption() {

		if ( textureEquirect !== undefined )
			scene.background = textureEquirect;
		render();

	}

	document.getElementById( 'background-color' ).addEventListener( 'input', onColorOption );

	document.getElementById( 'background' ).addEventListener( 'change', function ( event ) {

		resetBackgroundInput();

		switch ( event.target.value ) {

			case 'none':
				scene.background = null;
				render();
				break;
			case 'color':
				document.getElementById( 'background-color' ).style.setProperty( 'display', 'inherit' );
				onColorOption();
				break;
			case 'texture':
				document.getElementById( 'background-texture' ).style.setProperty( 'display', 'inherit' );
				onTextureOption();
				break;
			case 'equirect':
				document.getElementById( 'background-equirect' ).style.setProperty( 'display', 'inherit' );
				onEquirectOption();

		}

	} );

}
