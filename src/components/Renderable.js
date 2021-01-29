import { ComponentManager } from '../core/ComponentManager.js';
import { Object3D } from '../lib/three.js';

export class Renderable {

	init( data ) {

		if ( data === undefined )
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

}

ComponentManager.register( 'renderable', Renderable, {
	multiple: true,
} );
