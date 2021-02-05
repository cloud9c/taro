import { ComponentManager } from '../core/ComponentManager.js';
import { ObjectLoader } from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { DRACOLoader } from '../lib/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();

dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
gltfLoader.setDRACOLoader( dracoLoader );

const objectLoader = new ObjectLoader();

class Model {

	init( data ) {

		const extension = data.asset.split( '.' ).pop().toLowerCase();

		switch( extension ) {

			case 'glb'

			case 'js':
			case 'json':

			case '3geo':
			case '3mat':
			case '3obj':
			case '3scn':

			default:
				console.error( 'Model: invalid model extension ' + extension );

		}

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {



	}

	onDisable() {



	}

	onLoad( model ) {

		this.dispatchEvent( { type: 'load' } );

	}

	onError() {

		this.dispatchEvent( { type: 'error' } );

	}

	static config = {
		schema: {
			asset: { type: 'asset' },
		}
	};

}