export class AssetManager {

	constructor() {

		this.enabled = false;
		this.files = {};

	}

	add( key, file ) {

		if ( this.enabled === false ) return;
		
		this.files[ key ] = file;

	}

	get( key ) {
		
		if ( this.enabled === false ) return;

		return this.files[ key ];

	}

	remove( key ) {

		delete this.files[ key ];

	}

	clear() {

		this.files = {};

	}

}
