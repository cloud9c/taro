importScripts( './js/lib/idb-keyval.min.js' );

const cacheName = 'taro-editor';
const baseURL = self.location.href.replace( 'sw.js', '' );

const assets = [
	'./',

	'../files/favicon.ico',
	'../files/main.css',
	'../files/IBMPlexMono-Regular.woff2',
	'../files/IBMPlexMono-Medium.woff2',
	'../files/IBMPlexSans-Regular.woff2',
	'../files/IBMPlexSans-Medium.woff2',

	'../build/taro.module.js',

	'../examples/js/GLTFExporter.js',
	'../examples/js/OrbitControls.js',
	'../examples/js/TaroExporter.js',
	'../examples/js/TaroLoader.js',
	'../examples/js/TransformControls.js',
	'../examples/js/VRButton.js',

	//

	'./manifest.json',
	'./editor.css',

	'./img/add-alt.svg',
	'./img/camera.svg',
	'./img/caret.svg',
	'./img/chevron-down.svg',
	'./img/document.svg',
	'./img/folder.svg',
	'./img/geometry.svg',
	'./img/icon.png',
	'./img/light.svg',
	'./img/material.svg',
	'./img/physics-material.svg',
	'./img/script.svg',
	'./img/trash.svg',
	'./img/upload.svg',

	//

	'./js/Editor.js',
	'./js/EditorComponents.js',
	'./js/Navbar.js',
	'./js/Resizer.js',
	'./js/Sidebar.Assets.js',
	'./js/Sidebar.Inspector.js',
	'./js/Sidebar.js',
	'./js/Sidebar.Scene.js',
	'./js/Toolbar.js',
	'./js/Viewport.js',

	'./js/lib/app/index.html',
	'./js/lib/fflate.module.min.js',
	'./js/lib/idb-keyval.module.min.js',

];

self.addEventListener( 'install', async function () {

	const cache = await caches.open( cacheName );

	assets.forEach( function ( asset ) {

		cache.add( asset ).catch( function () {

			console.warn( '[SW] Cound\'t cache:', asset );

		} );

	} );

} );

self.addEventListener( 'fetch', async function ( event ) {

	const request = event.request;
	event.respondWith( cacheFirst( request ) );

} );

async function cacheFirst( request ) {

	const cachedResponse = await caches.match( request );

	if ( cachedResponse === undefined ) {

		const idbResponse = await idbKeyval.get( request.url.replace( baseURL, '' ) );

		if ( idbResponse !== undefined ) {

			return new Response( idbResponse );

		} else {

			console.warn( '[SW] Not cached:', request.url );
			return fetch( request );

		}

	}

	return cachedResponse;

}
