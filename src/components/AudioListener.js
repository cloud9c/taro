import { ComponentManager } from '../core/ComponentManager.js';
import { AudioListener as ThreeAudioListener } from '../lib/three.module.js';

export class AudioListener {

	init( data ) {

		this.AudioListenerInstance.setMasterVolume( data.masterVolume );
		this.AudioListenerInstance.timeDelta = data.timeDelta;

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.entity.add( AudioListener.prototype.AudioListenerInstance );

	}

	onDisable() {

		this.entity.remove( AudioListener.prototype.AudioListenerInstance );

	}

}

AudioListener.config = {
	schema: {
		masterVolume: { type: 'number', default: 1 },
		timeDelta: { type: 'number' }
	},
	multiple: true,
};

AudioListener.prototype.AudioListenerInstance = new ThreeAudioListener();

ComponentManager.registerComponent( 'audioListener', AudioListener );
