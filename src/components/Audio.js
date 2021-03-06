import { ComponentManager } from '../core/ComponentManager.js';
import { Audio as ThreeAudio, PositionalAudio, AudioLoader } from '../lib/three.module.js';
import { AudioListener } from './AudioListener.js';

const AudioListenerInstance = AudioListener.prototype.AudioListenerInstance;
const audioLoader = new AudioLoader();

class Audio {

	init( data ) {

		if ( data.positional === true ) {

			this.ref = new PositionalAudio( AudioListenerInstance );

			this.ref.setDistanceModel( data.distanceModel );
			this.ref.setMaxDistance( data.maxDistance );
			this.ref.setRefDistance( data.refDistance );
			this.ref.setRolloffFactor( data.rolloffFactor );

		} else {

			this.ref = new ThreeAudio( AudioListenerInstance );

		}

		this.ref.autoplay = data.autoplay;
		this.ref.detune = data.detune;
		this.ref.duration = data.duration !== 0 ? data.duration : undefined;
		this.ref.offset = data.offset;
		this.ref.setPlaybackRate( data.playbackRate );
		this.ref.setVolume( data.volume );

		if ( data.loop === true ) {

			this.ref.setLoop( data.loop );
			this.ref.setLoopStart( data.loopStart );
			this.ref.setLoopEnd( data.loopEnd );

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
		positional: { type: 'boolean' },
		asset: { type: 'asset' },

		autoplay: { type: 'boolean' },
		detune: { type: 'number' },
		duration: { type: 'number' },
		loop: { type: 'boolean' },
		loopEnd: { type: 'number', if: { loop: [ true ] } },
		loopStart: { type: 'number', if: { loop: [ true ] } },
		offset: { type: 'number' },
		playbackRate: { type: 'number', default: 1 },
		volume: { type: 'number', default: 1 },

		distanceModel: { type: 'select', default: 'inverse', select: [ 'linear', 'inverse', 'exponential' ], if: { positional: [ true ] } },
		maxDistance: { type: 'number', default: 10000, if: { positional: [ true ] } },
		refDistance: { type: 'number', default: 1, if: { positional: [ true ] } },
		rolloffFactor: { type: 'number', default: 1, if: { positional: [ true ] } },


	},
	multiple: true,
};

ComponentManager.registerComponent( 'audio', Audio );
