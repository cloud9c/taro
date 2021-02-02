import { ComponentManager } from '../../core/ComponentManager.js';
import { Box, Sphere, Plane, Cylinder, ConvexPolyhedron, Particle, Heightfield, Vec3 } from '../../lib/cannon.js';
import { Euler, Quaternion } from '../../lib/three.js';

const _e1 = new Euler();
const _q1 = new Quaternion();

class Shape {

	init( data ) {

		this.offset = data.offset;
		this.orientation = data.orientation;

		this.body = this.entity.getComponent( 'rigidbody' );
		const scale = this.body.cachedScale;
		const maxScale = Math.max( scale.x, scale.y, scale.z );

		switch ( data.type ) {

			case 'box':
				this.ref = new Box( new Vec3().copy( data.halfExtents.multiply( scale ) ) );
				break;
			case 'sphere':
				const radius = data.radius * maxScale;
				this.ref = new Sphere( radius );
				break;
			case 'plane':
				this.ref = new Plane();
				break;
			case 'cylinder':
				const radiusTop = data.radiusTop * maxScale;
				const radiusBottom = data.radiusBottom * maxScale;
				const height = data.height * maxScale;
				this.ref = new Cylinder( radiusTop, radiusBottom, height, data.numSegments );
				break;
			case 'convex':
				// TODO
				this.ref = new ConvexPolyhedron( data.vertices, data.faces, data.normals );
				break;
			case 'particle':
				this.ref = new Particle();
				break;
			case 'heightfield':
				// TODO
				this.ref = new Heightfield( data.data, { elementSize: data.elementSize } );
				break;
			default:
				throw new Error( 'Shape: invalid shape type ' + data.type );

		}

		this.ref.material = data.physicsMaterial;
		this.ref.collisionResponse = data.collisionResponse;
		this.ref.collisionFilterGroup = data.collisionFilterGroup;
		this.ref.collisionFilterMask = data.collisionFilterMask;

		this.data = data;

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.orientation = _q1.setFromEuler( _e1.setFromVector3( this.orientation ) );

		this.body.ref.addShape( this.ref, this.offset, this.orientation );

	}

	onDisable() {

		const body = this.body.ref;
		const index = this.shapes.indexOf( shape );

		body.shapes.splice( index, 1 );
		body.shapeOffsets.splice( index, 1 );
		body.shapeOrientations.splice( index, 1 );
		body.updateMassProperties();
		body.updateBoundingRadius();

		body.aabbNeedsUpdate = true;

		shape.body = null;

	}

}

// TODO: Research how to implement Trimesh type
ComponentManager.register( 'shape', Shape, {
	schema: {
		type: { type: 'select', default: 'box', select: [ 'box', 'sphere', 'plane', 'cylinder', 'convex', 'particle', 'heightfield' ] },
		physicsMaterial: { type: 'asset', default: null },

		halfExtents: { type: 'vector3', min: 0, default: [ 0.5, 0.5, 0.5 ], if: { type: [ 'box' ] } },
		radius: { default: 1, min: 0, if: { type: [ 'sphere' ] } },

		radiusTop: { default: 1, min: 0, if: { type: [ 'cylinder' ] } },
		radiusBottom: { default: 1, min: 0, if: { type: [ 'cylinder' ] } },
		height: { default: 1, min: 0, if: { type: [ 'cylinder' ] } },
		numSegments: { type: 'int', min: 0, default: 8, if: { type: [ 'cylinder' ] } },

		asset: { type: 'asset', if: { type: [ 'convex', 'heightfield' ] } },

		// TODO: see how to integrate maxValue and minValue, since they're both null by default...
		elementSize: { default: 1, if: { type: 'heightfield' } },

		offset: { type: 'vector3' },
		orientation: { type: 'vector3' },

		collisionResponse: { default: true },
		collisionFilterGroup: { type: 'int', default: 1 },
		collisionFilterMask: { type: 'int', default: - 1 },

	},
	dependency: [ 'rigidbody' ]
} );
