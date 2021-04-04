import { set, keys } from './lib/idb-keyval.module.min.js';

function addFileElement( path ) {

	const div = document.createElement( 'DIV' );

	if ( path[ path.length - 1 ] === '/' ) {

		div.dataset.hasFolder = '';
		path = path.substring( 0, path.length - 1 );

	}

	div.dataset.id = path;
	div.textContent = path.substring( path.lastIndexOf( '/' ) + 1 );

}

export function SidebarAssets( editor ) {

	const inspector = editor.inspector;
	const viewport = editor.viewport;
	const renderer = editor.app.renderer;
	const render = editor.render;
	const scene = viewport.scene;

	// add existing files
	keys().then( keys => {

		for ( let i = 0, len = keys.length; i < len; i ++ )
			addFileElement( keys[ i ] );

	} );

	const addAssets = document.getElementById( 'add-assets-list' ).children;
	const fileInput = document.createElement( 'INPUT' );

	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function () {

		for ( let i = 0, len = this.files.length; i < len; i ++ ) {

			set( file.name, file );
			addFileElement( file.name );

		}

	} );

	// upload
	addAssets[ 0 ].addEventListener( 'pointerdown', () => {

		fileInput.click();

	} );

}
