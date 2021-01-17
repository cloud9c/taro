import { AmbientLight, DirectionalLight, HemisphereLight, PointLight, SpotLight } from '../lib/three.js';

export class Light {

	init( data ) {

		const type = data.type !== undefined ? data.type : 'directional';
		const color = data.color !== undefined ? data.color : 0xffffff;
		const intensity = data.intensity !== undefined ? data.intensity : 1;

		let skyColor, groundColor, distance, decay, angle, penumbra;

		switch ( type ) {

			case 'ambient':
				this.ref = new AmbientLight( color, intensity );
				break;
			case 'directional':
				this.ref = new DirectionalLight( color, intensity );
				break;
			case 'hemisphere':
				skyColor = data.skyColor !== undefined ? data.skyColor : color;
				groundColor = data.groundColor !== undefined ? data.groundColor : color;
				this.ref = new HemisphereLight( skyColor, groundColor, intensity );
				break;
			case 'point':
				distance = data.distance !== undefined ? data.distance : 0;
				decay = data.decay !== undefined ? data.decay : 1;
				this.ref = new PointLight( color, intensity, distance, decay );
				break;
			case 'spot':
				distance = data.distance !== undefined ? data.distance : 0;
				angle = data.angle !== undefined ? data.angle : Math.PI / 3;
				penumbra = data.penumbra !== undefined ? data.penumbra : 0;
				decay = data.decay !== undefined ? data.decay : 1;
				this.ref = new SpotLight( color, intensity, distance, angle, penumbra, decay );
				break;
			default:
				throw new Error( 'Collider: invalid collider type ' + type );

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
