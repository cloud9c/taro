import { ComponentManager } from '../core/ComponentManager.js';
import { ObjectLoader } from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { DRACOLoader } from '../lib/DRACOLoader.js';

// githubusercontent dependency
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/' );

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader( dracoLoader );

const objectLoader = new ObjectLoader();

class Model {

	init( data ) {

		delete this.ref;
		if ( data.asset === '' ) return;

		const extension = data.asset.split( '.' ).pop().toLowerCase();

		switch ( extension ) {

			case 'glb':
			case 'gltf':
				this.promise = gltfLoader.load( data.asset, ( m ) => this.onGLTFLoad( m ), ( p ) => this.onProgress( p ), ( e ) => this.onError( e ) );
				break;
			case 'js':
			case 'json':
			case '3geo':
			case '3mat':
			case '3obj':
			case '3scn':
				this.promise = objectLoader.load( data.asset, ( m ) => this.onLoad( m ), ( p ) => this.onProgress( p ), () => this.onError() );
				break;

			default:
				console.error( 'Model: invalid model extension ' + extension );

		}

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		if ( this.ref !== undefined )
			this.entity.add( this.ref );

	}

	onDisable() {

		if ( this.ref !== undefined )
			this.entity.remove( this.ref );

	}

	onGLTFLoad( result ) {

		const scene = result.scene;
		scene.animations.push( ...result.animations );
		scene.castShadow = true;
		scene.receiveShadow = true;

		this.onLoad( scene );

	}

	onLoad( result ) {

		this.ref = result;

		if ( this._enabled ) this.onEnable();

		this.dispatchEvent( { type: 'load' } );

	}

	onProgress( event ) {

		this.dispatchEvent( { type: 'progress', progressEvent: event } );

	}

	onError( error ) {

		console.error( 'Model: failed retrieving asset' );
		this.dispatchEvent( { type: 'error', error } );

	}

	static config = {
		schema: {
			asset: { type: 'asset' },
		}
	};

}

ComponentManager.register( 'model', Model );
