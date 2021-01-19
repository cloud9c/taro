import { AmbientLight, DirectionalLight, HemisphereLight, PointLight, SpotLight } from '../lib/three.js';

export class Light {

	init( data ) {

		const type = data.type;
		const color = data.color;
		const intensity = data.intensity;

		switch ( type ) {

			case 'ambient':
				this.ref = new AmbientLight( color, intensity );
				break;
			case 'directional':
				this.ref = new DirectionalLight( color, intensity );
				break;
			case 'hemisphere':
				this.ref = new HemisphereLight( data.skyColor, data.groundColor, intensity );
				break;
			case 'point':
				this.ref = new PointLight( color, intensity, data.distance, data.decay );
				break;
			case 'spot':
				this.ref = new SpotLight( color, intensity, data.distance, data.angle, data.penumbra, data.decay );
				break;
			default:
				throw new Error( 'Light: invalid light type ' + type );

		}

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.entity.add( this.ref );

	}

	onDisable() {

		this.entity.remove( this.ref );

	}

}
