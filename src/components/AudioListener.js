import { ComponentManager } from '../core/ComponentManager.js';

export class AudioListener {

	init( data ) {

		this.ref = this.scene.audioListener;
		
		this.ref.setMasterVolume( data.masterVolume );
		this.ref.timeDelta = data.timeDelta;

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.entity.add( this.ref );

	}

	onDisable() {

		this.entity.remove( this.ref );

	}

}

AudioListener.config = {
	schema: {
		masterVolume: { type: 'number', default: 1 },
		timeDelta: { type: 'number' }
	}
};

ComponentManager.registerComponent( 'audioListener', AudioListener );
