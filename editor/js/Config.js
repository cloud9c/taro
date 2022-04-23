function Config() {

	const name = 'tarojs-editor';

	const storage = {
		'language': 'en',

		'autosave': true,

		'setting/title': '',
		'setting/editable': false,
		'setting/vr': false,

		'setting/renderer/antialias': true,
		'setting/renderer/shadows': true,
		'setting/renderer/shadowType': 1, // PCF
		'setting/renderer/physicallyCorrectLights': false,
		'setting/renderer/toneMapping': 0, // NoToneMapping
		'setting/renderer/toneMappingExposure': 1,

		'settings/history': false,

		'settings/shortcuts/translate': 'w',
		'settings/shortcuts/rotate': 'e',
		'settings/shortcuts/scale': 'r',
		'settings/shortcuts/undo': 'z',
		'settings/shortcuts/focus': 'f'
	};

	if ( window.localStorage[ name ] === undefined ) {

		window.localStorage[ name ] = JSON.stringify( storage );

	} else {

		const data = JSON.parse( window.localStorage[ name ] );

		for ( const key in data ) {

			storage[ key ] = data[ key ];

		}

	}

	return {

		getKey: function ( key ) {

			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...

			for ( let i = 0, l = arguments.length; i < l; i += 2 ) {

				storage[ arguments[ i ] ] = arguments[ i + 1 ];

			}

			window.localStorage[ name ] = JSON.stringify( storage );

			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			delete window.localStorage[ name ];

		}

	};

}

export { Config };
