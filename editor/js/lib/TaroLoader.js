import { Application, Entity, Scene, Loader } from '../../../build/taro.js';

export class TaroLoader extends Loader {

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const path = ( this.path === '' ) ? LoaderUtils.extractUrlBase( url ) : this.path;
		this.resourcePath = this.resourcePath || path;

		const loader = new FileLoader( this.manager );
		loader.setPath( this.path );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( this.withCredentials );
		loader.load( url, function ( text ) {

			let json = null;

			try {

				json = JSON.parse( text );

			} catch ( error ) {

				if ( onError !== undefined ) onError( error );

				console.error( 'TaroLoader: Can\'t parse ' + url + '.', error.message );

				return;

			}

			scope.parse( json, onLoad );

		}, onProgress, onError );

	}

	parse( json, onLoad ) {

		const app = this.app = new Application( json.parameters );
		this._componentManager = this.app.componentManager;
		const scenes = json.scenes;

		for ( let i = 0, len = scenes.length; i < len; i ++ ) {

			const scene = this.parseScene( scenes[ i ] );

			if ( scene.uuid === json.currentScene ) {

				app.setScene( scene );

			}

		}

		return app;

	}

	parseScene( data ) {

		const object = new Scene();

		if ( data.background !== undefined ) {

			if ( Number.isInteger( data.background ) ) {

				object.background = new Color( data.background );

			}

		}

		if ( data.fog !== undefined ) {

			if ( data.fog.type === 'Fog' ) {

				object.fog = new Fog( data.fog.color, data.fog.near, data.fog.far );

			} else if ( data.fog.type === 'FogExp2' ) {

				object.fog = new FogExp2( data.fog.color, data.fog.density );

			}

		}

	}

	parseEntity( data ) {

		const object = new Entity();

		object.uuid = data.uuid;
		object.matrix.fromArray( data.matrix );

		if ( data.tags !== undefined ) object.tags = data.tags;
		if ( data.name !== undefined ) object.name = data.name;
		if ( data.castShadow !== undefined ) object.castShadow = data.castShadow;
		if ( data.receiveShadow !== undefined ) object.receiveShadow = data.receiveShadow;
		if ( data.visible !== undefined ) object.visible = data.visible;
		if ( data.enabled !== undefined ) object.enabled = data.enabled;

		if ( data.components !== undefined ) {

			const components = data.components;
			for ( let i = 0, len = components.length; i < len; i ++ ) {

				object.addComponent( components[ i ].type, components[ i ].data );

			}

		}

		if ( data.children !== undefined ) {

			const children = data.children;
			for ( let i = 0, len = children.length; i < len; i ++ ) {

				object.add( parseEntity( children[ i ] ) );

			}

		}

	}

}
