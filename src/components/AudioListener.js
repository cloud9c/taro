import { ComponentManager } from '../core/ComponentManager.js';

export class AudioListener {

	init( data ) {

		this.app.audioListener.setMasterVolume( data.masterVolume );
		this.app.audioListener.timeDelta = data.timeDelta;

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.entity.add( this.app.audioListener );

	}

	onDisable() {

		this.entity.remove( this.app.audioListener );

	}

}

AudioListener.config = {
	schema: {
		masterVolume: { type: 'number', default: 1 },
		timeDelta: { type: 'number' }
	}
};

ComponentManager.registerComponent( 'audioListener', AudioListener );
