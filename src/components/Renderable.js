export class Renderable {

	init( data ) {

		if ( data.isObject3D === undefined )
			throw Error( 'Renderable must be an instance of Object3D' );

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
