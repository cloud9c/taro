import { applicationToJSON } from './lib/Jsonify.js';
import { TaroLoader } from './lib/TaroLoader.js';
import { Renderer } from '../../build/taro.module.js';

export function Navbar( editor ) {

	// Entity
	const entityMenu = document.getElementsByClassName( 'menu' )[ 2 ].getElementsByClassName( 'options' )[ 0 ].children;

	entityMenu[ 0 ].addEventListener( 'pointerdown', () => {

		editor.addEntity( 'Empty' );

		if ( editor.inspector.currentEntity !== undefined ) {

		}

	} );

	// Play/Stop
	const canvas = document.getElementById( 'canvas' );
	const player = document.getElementById( 'player' );
	const renderer = new Renderer( {
		canvas: player
	} );
	const playMenu = document.getElementsByClassName( 'menu' )[ 3 ];
	const taroLoader = new TaroLoader();
	let app;

	let isPlaying = false;
	playMenu.addEventListener( 'pointerdown', () => {

		if ( isPlaying ) { // stop it

			// dispose old app
			app.stop();
			app.dispose();
			app = undefined;

			canvas.style.position = '';
			canvas.style.visibility = '';
			player.style.display = '';
			playMenu.firstElementChild.textContent = 'Play';

		} else { // start it

			canvas.style.position = 'absolute';
			canvas.style.visibility = 'hidden';
			player.style.display = 'initial';

			const appJSON = applicationToJSON( editor.app );
			appJSON.parameters.canvas = player;
			appJSON.parameters.renderer = renderer;
			taroLoader.parse( appJSON, function ( newApp ) {

				playMenu.firstElementChild.textContent = 'Stop';

				app = newApp;
				app.start();

			} );

		}

		isPlaying = ! isPlaying;

	} );

}
