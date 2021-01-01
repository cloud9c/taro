import { ObjectLoader } from "../lib/three.js";

export class TaroLoader extends ObjectLoader {

	constructor( manager ) {

		super( manager );

	}

	parse( json, onLoad ) {

		super.parse( json, onLoad );

		// do stuff

	}

}
