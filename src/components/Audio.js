import { ComponentManager } from '../core/ComponentManager.js';
import { Object3D } from '../lib/three.module.js';
import { AudioListener } from './AudioListener.js';

const AudioListenerInstance = AudioListener.AudioListenerInstance;
const audioLoader = new AudioLoader();

class Audio {

	init( data ) {

		if ( data.positional === true ) {

		}

		if ( typeof data.source !== 'string' ) {



		} else if ( data.source.length > 0 ) {


		}

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

	},
	multiple: true,
};

ComponentManager.registerComponent( 'renderable', Renderable );
