import { HemisphereLight as HL } from "../../lib/three.js";

export class HemisphereLight extends HL {

	start( data ) {

		if ( "color" in data ) this.color.setHex( data.color );
		if ( "groundColor" in data ) this.groundColor.setHex( data.groundColor );
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
