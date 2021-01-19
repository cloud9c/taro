import { BoxBufferGeometry, CircleBufferGeometry, ConeBufferGeometry, CylinderBufferGeometry, DodecahedronBufferGeometry, ExtrudeBufferGeometry, IcosahedronBufferGeometry, LatheBufferGeometry, OctahedronBufferGeometry, ParametricBufferGeometry, PlaneBufferGeometry, PolyhedronBufferGeometry, RingBufferGeometry, ShapeBufferGeometry, SphereBufferGeometry, TetrahedronBufferGeometry, TextBufferGeometry, TorusBufferGeometry, TorusKnotBufferGeometry, TubeBufferGeometry } from '../lib/three.js';

export class Geometry {

	init( data ) {

		const primitive = data.primitive;

		switch ( primitive ) {

			case 'box':
				// const width = data.width !== undefined ? data.width : 1;
				// const height = data.height !== undefined ? data.height : 1;
				// const depth = data.depth !== undefined ? data.depth : 1;
				// const widthSegments = data.widthSegments !== undefined ? data.widthSegments : 1;
				// const heightSegments = data.heightSegments !== undefined ? data.heightSegments : 1;
				// const depthSegments = data.depthSegments !== undefined ? data.depthSegments : 1;
				this.ref = new BoxBufferGeometry( data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments );
				break;
			case 'cricle':
				// const radius = data.radius !== undefined ? data.radius : 1;
				// const segments = data.segments !== undefined ? data.segments : 8;
				// const thetaStart = data.thetaStart !== undefined ? data.thetaStart : 0;
				// const thetaLength = data.thetaLength !== undefined ? data.thetaLength : 2 * Math.PI;
				this.ref = new CircleBufferGeometry( data.radius, data.segments, data.thetaStart, data.thetaLength );
				break;
			case 'cone':
				// const radius = data.radius !== undefined ? data.radius : 1;
				// const height = data.height !== undefined ? data.height : 1;
				// const radialSegments = data.radialSegments !== undefined ? data.radialSegments : 8;
				// const heightSegments = data.heightSegments !== undefined ? data.heightSegments : 1;
				// const thetaStart = data.thetaStart !== undefined ? data.thetaStart : 0;
				// const thetaLength = data.thetaLength !== undefined ? data.thetaLength : 2 * Math.PI;
				this.ref = new ConeBufferGeometry( data.radius, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength );
				break;
			default:
				throw new Error( 'Geometry: invalid geometry type ' + type );

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
