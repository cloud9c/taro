import { ComponentManager } from '../../core/ComponentManager.js';
import { Box, Sphere, Plane, Cylinder, ConvexPolyhedron, Particle, Heightfield, Vec3 } from '../../lib/cannon-es.js';
import { Euler, Quaternion } from '../../lib/three.module.js';

const _e1 = new Euler();
const _q1 = new Quaternion();

class Shape {

	init( data ) {

		this.type = data.type;
		this.offset = data.offset;
		this.orientation = data.orientation;

		this.body = this.entity.getComponent( 'rigidbody' );
		const scale = this.body.cachedScale;
		const maxScale = Math.max( scale.x, scale.y, scale.z );

		switch ( this.type ) {

			case 'box':
				const halfExtents = new Vec3().copy( data.halfExtents );
				halfExtents.vmul( scale, halfExtents );
				this.ref = new Box( halfExtents );
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
				const minValue = data.minValue !== 0 ? data.minValue : null;
				const maxValue = data.maxValue !== 0 ? data.maxValue : null;
				this.ref = new Heightfield( data.data, { elementSize: data.elementSize, minValue, maxValue } );
				break;
			default:
				console.error( 'Shape: invalid shape type ' + this.type );

		}

		if ( data.material.length > 0 ) {

			this.ref.material = this.app.assets.get( data.material );
			if ( this.ref.material === undefined )
				fileLoader.load( data.material, ( json ) => this.onMaterialLoad( data.material, json ), ( p ) => this.onProgress( p ), ( e ) => this.onError( e ) );

		}

		this.ref.collisionResponse = data.collisionResponse;
		this.ref.collisionFilterGroup = data.collisionFilterGroup;
		this.ref.collisionFilterMask = data.collisionFilterMask;

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	updateScale( scale ) {

		const maxScale = Math.max( scale.x, scale.y, scale.z );
		const shape = this.ref;
		switch ( this.type ) {

			case 'box':
				const halfExtents = shape.halfExtents;
				halfExtents.vmul( scale, halfExtents );
				shape.updateConvexPolyhedronRepresentation();
				shape.updateBoundingSphereRadius();
				break;
			case 'sphere':
				shape.radius *= maxScale;
				shape.updateBoundingSphereRadius();
				break;
			case 'plane':
				break;
			case 'cylinder':
				shape.radiusTop *= maxScale;
				shape.radiusBottom *= maxScale;
				shape.height *= maxScale;
				shape.updateBoundingSphereRadius();
				shape.worldVerticesNeedsUpdate = true;
				shape.worldFaceNormalsNeedsUpdate = true;
				break;
			case 'convex':
				// TODO
				break;
			case 'particle':
				break;
			case 'heightfield':
				// TODO

		}

		shape.body.updateMassProperties();

	}

	onMaterialLoad( key, json ) {

		const material = new Material( json );
		this.ref.material = material;
		this.app.assets.add( key, material );

		this.dispatchEvent( { type: 'load', material } );

	}

	onProgress( event ) {

		this.dispatchEvent( { type: 'progress', event } );

	}

	onError( event ) {

		console.error( 'Shape: failed retrieving asset' );
		this.dispatchEvent( { type: 'error', event } );

	}

	onEnable() {

		this.orientation = _q1.setFromEuler( _e1.setFromVector3( this.orientation ) );

		this.body.ref.addShape( this.ref, this.offset, this.orientation );

	}

	onDisable() {

		const body = this.body.ref;
		const index = body.shapes.indexOf( this.ref );

		body.shapes.splice( index, 1 );
		body.shapeOffsets.splice( index, 1 );
		body.shapeOrientations.splice( index, 1 );
		body.updateMassProperties();
		body.updateBoundingRadius();

		body.aabbNeedsUpdate = true;

		this.ref.body = null;

	}

}

Shape.config = {
	schema: {
		type: { type: 'select', default: 'box', select: [ 'box', 'sphere', 'plane', 'cylinder', 'convex', 'particle', 'heightfield' ] },

		halfExtents: { type: 'vector3', min: 0, default: [ 0.5, 0.5, 0.5 ], if: { type: [ 'box' ] } },
		radius: { default: 1, min: 0, if: { type: [ 'sphere' ] } },

		radiusTop: { default: 1, min: 0, if: { type: [ 'cylinder' ] } },
		radiusBottom: { default: 1, min: 0, if: { type: [ 'cylinder' ] } },
		height: { default: 1, min: 0, if: { type: [ 'cylinder' ] } },
		numSegments: { type: 'int', min: 0, default: 8, if: { type: [ 'cylinder' ] } },

		asset: { type: 'asset', if: { type: [ 'convex', 'heightfield' ] } },

		elementSize: { default: 1, if: { type: 'heightfield' } },
		minValue: { default: 0, if: { type: 'heightfield' } },
		maxValue: { default: 0, if: { type: 'heightfield' } },

		offset: { type: 'vector3' },
		orientation: { type: 'vector3' },

		material: { type: 'asset' },
		collisionResponse: { default: true },
		collisionFilterGroup: { type: 'int', default: 1 },
		collisionFilterMask: { type: 'int', default: - 1 },

	},
	dependencies: [ 'rigidbody' ],
	multiple: true,
};

// TODO: Research how to implement Trimesh type
ComponentManager.registerComponent( 'shape', Shape );
