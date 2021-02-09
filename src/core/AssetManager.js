export class AssetManager {

	constructor() {

		this.files = {};

	}

	add( key, file ) {

		this.files[ key ] = file;

	}

	get( key ) {

		return this.files[ key ];

	}

	remove( key ) {

		delete this.files[ key ];

	}

	clear() {

		this.files = {};

	}

}
