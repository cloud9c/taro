import { ComponentManager } from '../core/ComponentManager.js';
import { Object3D } from '../lib/three.js';

class Renderable {

	init( data ) {

		if ( data.isObject3D === undefined )
			data = new Object3D();

		this.ref = data;
		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.entity.add( this.ref );

	}

	onDisable() {

		this.entity.remove( this.ref );

	}

	static config = {
		multiple: true,
	}

}

ComponentManager.register( 'renderable', Renderable );
