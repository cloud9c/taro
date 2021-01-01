import { ObjectLoader } from "../lib/three.js";
import { Application } from "../core/Application.js";

export class TaroLoader extends ObjectLoader {

	constructor( manager ) {

		super( manager );

	}

	parse( json, onLoad ) {

		const scenes = json.scenes;
		const app = new Application( json.parameters );

		for ( let i = 0, len = scenes.length; i < len; i ++ ) {

			app.addScene( super.parse( scenes[ i ] ) );

		}

		// app.setScene( app.findSceneByProperty( "uuid", json.currentScene ) );

		if ( onLoad !== undefined ) onLoad( app );

		return app;

	}

}
