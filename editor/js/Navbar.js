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

			// dispose old app
			app.stop();
			app.dispose();
			app.renderer.forceContextLoss();
			app = undefined;

			// clear webgl context
			const newPlayer = player.cloneNode( true );
			console.log( newPlayer, player );
			player.parentNode.replaceChild( newPlayer, player );
			player = newPlayer;

			canvas.style.display = '';
			player.style.display = '';
			playMenu.firstElementChild.textContent = 'Play';

		} else { // start it

			canvas.style.display = 'none';
			player.style.display = 'initial';

			const appJSON = applicationToJSON( editor.app );
			appJSON.parameters.canvas = player;
			taroLoader.parse( appJSON, function ( newApp ) {

				playMenu.firstElementChild.textContent = 'Stop';

				app = newApp;
				app.start();
				// console.log( app.currentScene );

			} );

		}

		isPlaying = ! isPlaying;

	} );

}
