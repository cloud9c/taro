import { TextureLoader } from '../../build/taro.js';
import * as TARO from '../../build/taro.js';

export function SidebarScene( scene ) {

	const textureLoader = new TextureLoader();

	let colorBackground = '#000000';
	let textureBackground;
	let textureEquirect;

	function resetBackgroundInput() {

		document.getElementById( 'background-color' ).style.removeProperty( 'display' );
		document.getElementById( 'background-texture' ).style.removeProperty( 'display' );
		document.getElementById( 'background-equirect' ).style.removeProperty( 'display' );

	}

	document.getElementById( 'background' ).addEventListener( 'change', function ( event ) {

		resetBackgroundInput();

		switch ( event.target.value ) {

			case 'none':
				scene.background = null;
				break;
			case 'color':
				document.getElementById( 'background-color' ).style.setProperty( 'display', 'inherit' );
				app.scene.background = new TARO.Color(document.getElementById( 'background-color' ).value);
				break;
			case 'texture':
				document.getElementById( 'background-texture' ).style.setProperty( 'display', 'inherit' );
				break;
			case 'equirect':
				document.getElementById( 'background-equirect' ).style.setProperty( 'display', 'inherit' );

		}

		app.renderer.update();

	} );

}
