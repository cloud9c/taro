import { ComponentManager } from '../core/ComponentManager.js';
import { AudioListener as ThreeAudioListener } from '../lib/three.module.js';

export class AudioListener {

	init( data ) {

		AudioListener.AudioListenerInstance.setMasterVolume( data.masterVolume );
		AudioListener.AudioListenerInstance.timeDelta = data.timeDelta;

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.entity.add( AudioListener.AudioListenerInstance );

	}

	onDisable() {

		this.entity.remove( AudioListener.AudioListenerInstance );

	}

}

AudioListener.config = {
	schema: {
		masterVolume: { type: 'number', default: 1 },
		timeDelta: { type: 'number' }
	},
	multiple: true,
};

AudioListener.AudioListenerInstance = new ThreeAudioListener();

ComponentManager.registerComponent( 'audioListener', AudioListener );
