import { applicationToJSON } from './lib/Jsonify.js';
import { TaroLoader } from './lib/TaroLoader.js';

export function Navbar( editor ) {

	const canvas = document.getElementById( 'canvas' );
	let player = document.getElementById( 'player' );
	const playMenu = document.getElementsByClassName( 'menu' )[ 3 ];
	const taroLoader = new TaroLoader();
	let app;

	let isPlaying = false;
	playMenu.addEventListener( 'pointerdown', function () {

		if ( isPlaying ) { // stop it

			canvas.style.display = '';
			player.style.display = '';
			playMenu.firstElementChild.textContent = 'Play';

			app.stop();
			app.dispose();
			app = undefined;

		} else { // start it

			const appJSON = applicationToJSON( editor.app );
			appJSON.parameters.canvas = player;
			taroLoader.parse( appJSON, function ( newApp ) {

				canvas.style.display = 'none';
				player.style.display = 'initial';
				playMenu.firstElementChild.textContent = 'Stop';

				app = newApp;
				app.start();

			} );

		}

		isPlaying = ! isPlaying;

	} );

}
