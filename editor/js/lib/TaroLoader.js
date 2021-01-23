import { Application, Entity, Scene } from '../../../build/taro.js';

export class TaroLoader {

	load( json ) {

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

	parseScene( scene ) {

	}

	parseEntity( entity ) {

	}

}
