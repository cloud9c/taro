import { applicationToJSON } from './lib/Jsonify.js';
import { TaroLoader } from './lib/TaroLoader.js';
import { Renderer } from '../../build/taro.module.js';

export function Navbar( editor ) {

	const inspector = editor.inspector;

	// Entity
	const entityMenu = document.getElementsByClassName( 'menu' )[ 2 ].getElementsByClassName( 'options' )[ 0 ];

	entityMenu.addEventListener( 'pointerdown', ( event ) => {

		const preset = event.target.textContent;

		let entity = editor.addEntity( preset );

		switch ( preset ) {

			case 'Empty':
				break;
			case 'Box':
				inspector.addComponent( entity, 'geometry', { type: 'box' } );
				inspector.addComponent( entity, 'material', { type: 'phong' } );
				break;
			case 'Sphere':
				inspector.addComponent( entity, 'geometry', { type: 'sphere' } );
				inspector.addComponent( entity, 'material', { type: 'phong' } );
				break;
			case 'Cone':
				inspector.addComponent( entity, 'geometry', { type: 'cone' } );
				inspector.addComponent( entity, 'material', { type: 'phong' } );
				break;
			case 'Cylinder':
				inspector.addComponent( entity, 'geometry', { type: 'cylinder' } );
				inspector.addComponent( entity, 'material', { type: 'phong' } );
				break;
			case 'Model':
				inspector.addComponent( entity, 'model', { asset: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Duck/glTF-Binary/Duck.glb' } );
				break;
			case 'Light':
				inspector.addComponent( entity, 'light' );
				break;
			case 'Camera':
				inspector.addComponent( entity, 'camera' );
				break;

		}

		if ( editor.viewport.currentEntity !== undefined ) {

			const child = document.querySelector( '#scene-tree [data-id="' + entity.id + '"]' );
			const parent = document.querySelector( '#scene-tree [data-id="' + editor.viewport.currentEntity.id + '"]' );

			editor.viewport.onDragStart.call( child );
			editor.viewport.onDrop.call( parent );

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
