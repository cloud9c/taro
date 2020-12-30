import { DirectionalLight as DL } from "../../lib/three.js";

export class DirectionalLight extends DL {

	start( data ) {

		if ( "color" in data ) this.color.setHex( data.color );
		if ( "intensity" in data ) this.intensity = data.intensity;

		this.addEventListener( "enable", this.onEnable );
		this.addEventListener( "disable", this.onDisable );

	}

	onEnable() {

		this.entity.add( this );

	}

	onDisable() {

		this.entity.remove( this );

	}

}
