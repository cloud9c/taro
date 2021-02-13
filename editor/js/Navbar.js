import { applicationToJSON } from '../../examples/js/Jsonify.js';
import { TaroLoader } from '../../examples/js/TaroLoader.js';
import { GLTFExporter } from '../../examples/js/GLTFExporter.js';
import { Renderer } from '../../build/taro.module.js';

const exporter = new GLTFExporter();
const link = document.createElement( 'a' );

export function Navbar( editor ) {

	const inspector = editor.inspector;
	const viewport = editor.viewport;
	const sidebarScene = editor.sidebarScene;

	// File
	const fileOptions = document.getElementsByClassName( 'menu' )[ 0 ].getElementsByClassName( 'options' )[ 0 ].children;

	function getAnimations( scene ) {

		var animations = [];

		scene.traverse( function ( object ) {

			animations.push( ... object.animations );

		} );

		return animations;

	}

	function save( blob, filename ) {

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.dispatchEvent( new MouseEvent( 'click' ) );

		// URL.revokeObjectURL( url ); breaks Firefox...

	}

	// Export GLB
	fileOptions[ 3 ].addEventListener( 'pointerdown', () => {

		exporter.parse( viewport.scene, ( result ) => {

			const blob = new Blob( [ result ], { type: 'application/octet-stream' } );

			save( blob, 'scene.glb' );

		}, { binary: true, animations: getAnimations( viewport.scene ) } );

	} );

	// Export GLTF
	fileOptions[ 4 ].addEventListener( 'pointerdown', () => {

		exporter.parse( viewport.scene, ( result ) => {

			const text = JSON.stringify( result, null, 2 );
			const blob = new Blob( [ text ], { type: 'text/plain' } );

			save( blob, 'scene.gltf' );

		}, { animations: getAnimations( viewport.scene ) } );

	} );

	// Edit
	const editMenu = document.getElementsByClassName( 'menu' )[ 1 ];
	const editOptions = document.getElementsByClassName( 'menu' )[ 1 ].getElementsByClassName( 'options' )[ 0 ].children;
	editMenu.addEventListener( 'focus', ( event ) => {

		// Copy
		if ( viewport.currentEntity === undefined )
			editOptions[ 3 ].dataset.disabled = true;

		// Paste
		if ( sidebarScene.clipboard === undefined )
			editOptions[ 4 ].dataset.disabled = true;

		// Paste as Child
		if ( sidebarScene.clipboard === undefined || viewport.currentEntity === undefined )
			editOptions[ 5 ].dataset.disabled = true;

		// Rename
		// if ( viewport.currentEntity === undefined )
		// 	editOptions[ 6 ].dataset.disabled = true;

		// Clone
		if ( viewport.currentEntity === undefined )
			editOptions[ 6 ].dataset.disabled = true;

		// Delete
		if ( viewport.currentEntity === undefined )
			editOptions[ 7 ].dataset.disabled = true;

	} );

	editMenu.addEventListener( 'focusout', ( event ) => {

		for ( let i = 3, len = editOptions.length; i < len; i ++ )
			delete editOptions[ i ].dataset.disabled;

	} );

	// Copy
	editOptions[ 3 ].addEventListener( 'pointerdown', () => {

		sidebarScene.onCopy();
		editMenu.blur();
		editMenu.focus();

	} );

	// Paste
	editOptions[ 4 ].addEventListener( 'pointerdown', () => {

		sidebarScene.onPaste();

	} );

	// Paste as Child
	editOptions[ 5 ].addEventListener( 'pointerdown', () => {

		sidebarScene.onPasteAsChild();

	} );

	// Rename
	// editOptions[ 6 ].addEventListener( 'pointerdown', () => {

	// 	sidebarScene.onRename();

	// } );

	// Clone
	editOptions[ 6 ].addEventListener( 'pointerdown', () => {

		sidebarScene.onClone();

	} );

	// Delete
	editOptions[ 7 ].addEventListener( 'pointerdown', () => {

		sidebarScene.onDelete();

	} );

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
				inspector.addComponent( entity, 'shape', { type: 'box' } );
				break;
			case 'Sphere':
				inspector.addComponent( entity, 'geometry', { type: 'sphere' } );
				inspector.addComponent( entity, 'material', { type: 'phong' } );
				inspector.addComponent( entity, 'shape', { type: 'sphere' } );
				break;
			case 'Plane':
				entity.rotation.x = - Math.PI / 2;
				inspector.addComponent( entity, 'geometry', { type: 'plane', height: 10, width: 10 } );
				inspector.addComponent( entity, 'material', { type: 'phong' } );
				inspector.addComponent( entity, 'shape', { type: 'plane' } );
				break;
			case 'Cone':
				inspector.addComponent( entity, 'geometry', { type: 'cone' } );
				inspector.addComponent( entity, 'material', { type: 'phong' } );
				inspector.addComponent( entity, 'shape', { type: 'cylinder', radiusTop: 0 } );
				break;
			case 'Cylinder':
				inspector.addComponent( entity, 'geometry', { type: 'cylinder' } );
				inspector.addComponent( entity, 'material', { type: 'phong' } );
				inspector.addComponent( entity, 'shape', { type: 'cylinder' } );
				break;
			case 'Model':
				inspector.addComponent( entity, 'model', { asset: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Duck/glTF-Binary/Duck.glb' } );
				break;
			case 'Light':
				inspector.addComponent( entity, 'light' );
				break;
			case 'Camera':
				inspector.addComponent( entity, 'camera' );

		}

		if ( editor.viewport.currentEntity !== undefined ) {

			const child = document.querySelector( '#scene [data-id="' + entity.id + '"]' );
			const parent = document.querySelector( '#scene [data-id="' + editor.viewport.currentEntity.id + '"]' );

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

	// Help
	const helpMenu = document.getElementsByClassName( 'menu' )[ 4 ].getElementsByClassName( 'options' )[ 0 ].children;

	helpMenu[ 0 ].addEventListener( 'pointerdown', () => {

		window.open( 'https://www.echou.xyz/taro/docs', '_blank' );

	} );

	helpMenu[ 1 ].addEventListener( 'pointerdown', () => {

		window.open( 'https://github.com/Cloud9c/taro', '_blank' );

	} );

}
