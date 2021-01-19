import { BufferGeometry, BoxBufferGeometry, CircleBufferGeometry, ConeBufferGeometry, CylinderBufferGeometry, DodecahedronBufferGeometry, ExtrudeBufferGeometry, IcosahedronBufferGeometry, LatheBufferGeometry, OctahedronBufferGeometry, ParametricBufferGeometry, PlaneBufferGeometry, PolyhedronBufferGeometry, RingBufferGeometry, ShapeBufferGeometry, SphereBufferGeometry, TetrahedronBufferGeometry, TextBufferGeometry, TorusBufferGeometry, TorusKnotBufferGeometry, TubeBufferGeometry } from '../lib/three.js';

export class Geometry {

	init( data ) {

		const primitive = data.primitive;

		switch ( primitive ) {

			case 'box':
				this.ref = new BoxBufferGeometry( data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments );
				break;
			case 'cricle':
				this.ref = new CircleBufferGeometry( data.radius, data.segments, data.thetaStart, data.thetaLength );
				break;
			case 'cone':
				this.ref = new ConeBufferGeometry( data.radius, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength );
				break;
			case 'cylinder':
				this.ref = new CylinderBufferGeometry( data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength );
				break;
			case 'dodecahedron':
				this.ref = new DodecahedronBufferGeometry( data.radius, data.detail );
				break;
			case 'icosahedron':
				this.ref = new IcosahedronBufferGeometry( data.radius, data.detail );
				break;
			case 'octahedron':
				this.ref = new OctahedronBufferGeometry( data.radius, data.detail );
				break;
			case 'plane':
				this.ref = new PlaneBufferGeometry( data.width, data.height, data.widthSegments, data.heightSegments );
				break;
			case 'ring':
				this.ref = new RingBufferGeometry( data.innerRadius, data.outerRadius, data.thetaSegments, data.phiSegments, data.thetaStart, data.thetaLength );
				break;
			case 'sphere':
				this.ref = new SphereBufferGeometry( data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength );
				break;
			case 'tetrahedron':
				this.ref = new TetrahedronBufferGeometry( data.radius, data.detail );
				break;
			case 'torus':
				this.ref = new TorusBufferGeometry( data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc );
				break;
			case 'torusKnot':
				this.ref = new TorusKnotBufferGeometry( data.radius, data.tube, data.tubularSegments, data.radialSegments, data.p, data.q );
				break;
			case 'custom':
				this.ref = new BufferGeometry();
				break;
			default:
				throw new Error( 'Geometry: invalid geometry primitive ' + primitive );

		}

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		// this.entity.add( this.ref );

	}

	onDisable() {

		// this.entity.remove( this.ref );

	}

}
