import { ComponentManager } from '../core/ComponentManager.js';
import { Object3D } from '../lib/three.module.js';
import { AudioListener } from './AudioListener.js';

const AudioListenerInstance = AudioListener.AudioListenerInstance;
const audioLoader = new AudioLoader();

class Audio {

	init( data ) {

		if ( data.positional === true ) {

		}

		if ( typeof data.asset === 'object' ) {

			this.ref.setBuffer( data.asset );

		} else if ( data.asset.length > 0 ) {

			audioLoader.load( data.asset, ( b ) => this.onLoad( data.asset, b ), ( p ) => this.onProgress( p ), ( e ) => this.onError( e ) );

		}

	}

	onLoad( key, buffer ) {

		this.app.assets.add( key, buffer );

		this.ref.setBuffer( buffer );

		this.dispatchEvent( { type: 'load', buffer } );

	}

	onProgress( event ) {

		this.dispatchEvent( { type: 'progress', event } );

	}

	onError( event ) {

		console.error( 'Audio: failed retrieving asset' );
		this.dispatchEvent( { type: 'error', event } );

	}

	onEnable() {

		this.entity.add( this.ref );

	}

	onDisable() {

		this.entity.remove( this.ref );

	}

}

Audio.config = {
	schema: {
		asset: { type: 'asset' },
		positional
	},
	multiple: true,
};

ComponentManager.registerComponent( 'renderable', Renderable );
