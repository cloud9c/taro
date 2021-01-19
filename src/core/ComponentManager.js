import { Camera } from '../components/Camera.js';
import { Geometry } from '../components/Geometry.js';
import { Light } from '../components/Light.js';
import { Renderable } from '../components/Renderable.js';

import { Collider } from '../components/physics/Collider.js';
import { Joint } from '../components/physics/Joint.js';
import { Rigidbody } from '../components/physics/Rigidbody.js';

import { AngularLimit } from '../physics/AngularLimit.js';
import { LinearLimit } from '../physics/LinearLimit.js';
import { SpringDamper } from '../physics/SpringDamper.js';

import { EventDispatcher, Vector4, Vector3, Vector2 } from '../lib/three.js';

export class ComponentManager {

	constructor() {

		this.components = {};
		this.properties = {
			componentType: { value: null },
			_enabled: { value: true, writable: true },
			enabled: {
				get() {

					return this._enabled;

				},
				set( value ) {

					if ( value != this._enabled ) {

						if ( value && ! this.entity._enabled )
							return console.warn(
								"Component: Can't enable if the entity is disabled"
							);
						this._enabled = value;

						const container = this.entity.scene._containers[
							this.componentType
						];
						if ( value ) {

							container.push( this );
							this.dispatchEvent( { type: 'enable' } );

						} else {

							container.splice( container.indexOf( this ), 1 );
							this.dispatchEvent( { type: 'disable' } );

						}

					}

				},
			},
			scene: {
				get() {

					return this.entity.scene;

				}
			},
			app: {
				get() {

					return this.entity.scene.app;

				}
			}
		};

		this.register( 'camera', Camera, {
			schema: {
				autoAspect: { default: true },
				fov: { default: 50 },
				near: { default: 0.1 },
				far: { default: 2000 },
				aspect: { default: 1 },
				viewport: { type: 'vector4', default: [ 0, 0, 1, 1 ] }
			}
		} );
		this.register( 'geometry', Geometry, {
			schema: {
				primitive: { default: 'box' },

				depth: { default: 1, min: 0, if: { type: [ 'box' ] } },
				height: { default: 1, min: 0, if: { type: [ 'box', 'cone', 'cylinder', 'plane' ] } },
				width: { default: 1, min: 0, if: { type: [ 'box', 'plane' ] } },
				heightSegments: { default: 1, min: 1, max: 20, type: 'int', if: { type: [ 'box', 'plane' ] } },
				widthSegments: { default: 1, min: 1, max: 20, type: 'int', if: { type: [ 'box', 'plane' ] } },
				depthSegments: { default: 1, min: 1, max: 20, type: 'int', if: { type: [ 'box' ] } },

				radius: { default: 1, min: 0, if: { type: [ 'circle', 'cone', 'cylinder', 'dodecahedron', 'icosahedron', 'octahedron', 'sphere', 'tetrahedron', 'torus', 'torusKnot' ] } },
				segments: { default: 32, min: 3, type: 'int', if: { type: [ 'circle' ] } },
				thetaLength: { default: 360, min: 0, if: { type: [ 'circle', 'cone', 'cylinder', 'ring' ] } },
				thetaStart: { default: 0, if: { type: [ 'circle', 'cone', 'cylinder', 'ring', 'sphere' ] } },

				openEnded: { default: false, if: { type: [ 'cone', 'cylinder' ] } },
				heightSegments: { default: 18, min: 1, type: 'int', if: { type: [ 'cone', 'cylinder' ] } },
				radialSegments: { default: 36, min: 3, type: 'int', if: { type: [ 'cone', 'cylinder' ] } },

				detail: { default: 0, min: 0, max: 5, type: 'int', if: { type: [ 'dodecahedron', 'icosahedron', 'octahedron', 'tetrahedron' ] } },

				innerRadius: { default: 0.8, min: 0, if: { type: [ 'ring' ] } },
				outerRadius: { default: 1.2, min: 0, if: { type: [ 'ring' ] } },
				phiSegments: { default: 10, min: 1, type: 'int', if: { type: [ 'ring' ] } },
				thetaSegments: { default: 32, min: 3, type: 'int', if: { type: [ 'ring' ] } },

				phiLength: { default: 360, if: { type: [ 'sphere' ] } },
				phiStart: { default: 0, min: 0, if: { type: [ 'sphere' ] } },
				thetaLength: { default: 180, min: 0, if: { type: [ 'sphere' ] } },
				heightSegments: { default: 18, min: 2, type: 'int', if: { type: [ 'sphere' ] } },
				widthSegments: { default: 36, min: 3, type: 'int', if: { type: [ 'sphere' ] } },

				tube: { default: 0.2, min: 0, if: { type: [ 'torus', 'torusKnot' ] } },
				radialSegments: { default: 36, min: 2, type: 'int', if: { type: [ 'torus' ] } },
				tubularSegments: { default: 32, min: 3, type: 'int', if: { type: [ 'torus' ] } },
				arc: { default: 360, if: { type: [ 'torus' ] } },

				p: { default: 2, min: 1, if: { type: [ 'torusKnot' ] } },
				q: { default: 3, min: 1, if: { type: [ 'torusKnot' ] } },
				radialSegments: { default: 8, min: 3, type: 'int', if: { type: [ 'torusKnot' ] } },
				tubularSegments: { default: 64, min: 3, type: 'int', if: { type: [ 'torusKnot' ] } },
			}
		} );
		this.register( 'light', Light, {
			schema: {
				type: { default: 'directional' },
				color: { default: '#ffffff' },
				intensity: { default: 1 },
				skyColor: { default: '#ffffff', if: { type: [ 'hemisphere' ] } },
				groundColor: { default: '#ffffff', if: { type: [ 'hemisphere' ] } },
				distance: { default: 0, if: { type: [ 'point', 'spot' ] } },
				decay: { default: 1, if: { type: [ 'point', 'spot' ] } },
				angle: { default: Math.PI / 3, if: { type: [ 'spot' ] } },
				penumbra: { default: 0, if: { type: [ 'spot' ] } }
			}
		} );
		this.register( 'renderable', Renderable );
		this.register( 'collider', Collider, {
			schema: {
				type: { default: 'box' },
				isTrigger: { default: false },
				collisionGroup: { type: 'int', default: 1 },
				collisionMask: { type: 'int', default: 1 },
				center: { type: 'vector3' },
				rotation: { type: 'vector3' },
				friction: { default: 0.2 },
				restitution: { default: 0.2 },
				halfExtents: { type: 'vector3', default: [ 1, 1, 1 ], if: { type: [ 'box' ] } },
				radius: { default: 0.5, if: { type: [ 'capsule', 'cone', 'cylinder', 'sphere' ] } },
				halfHeight: { default: 1, if: { type: [ 'capsule', 'cone', 'cylinder' ] } },
				mesh: { type: 'asset', if: { type: [ 'mesh' ] } },
			}
		} );
		this.register( 'joint', Joint, {
			dependencies: [ 'rigidbody' ],
			schema: {
				type: { default: 'universal' },
				linkedEntity: { type: 'entity' },
				allowCollision: { default: false },
				breakForce: { default: 0 },
				breakTorque: { default: 0 },
				anchor: { type: 'vector3' },
				linkedAnchor: { type: 'vector3' },
				springDamper: { default: SpringDamper, if: { type: [ 'ball', 'hinge', 'prismatic', 'universal' ] } },
				axis: { type: 'vector3', default: [ 1, 0, 0 ], if: { type: [ 'cylindrical', 'hinge', 'prismatic', 'universal' ] } },
				linkedAxis: { type: 'vector3', default: [ 1, 0, 0 ], if: { type: [ 'cylindrical', 'hinge', 'prismatic', 'universal' ] } },
				linearLimit: { default: LinearLimit, if: { type: [ 'cylindrical', 'prismatic' ] } },
				linearSpringDamper: { default: SpringDamper, if: { type: [ 'cylindrical' ] } },
				angularLimit: { default: AngularLimit, if: { type: [ 'cylindrical', 'hinge', 'universal' ] } },
				angularSpringDamper: { default: SpringDamper, if: { type: [ 'cylindrical' ] } },
				twistAxis: { type: 'vector3', default: [ 1, 0, 0 ], if: { type: [ 'ragdoll' ] } },
				linkedTwistAxis: { type: 'vector3', default: [ 1, 0, 0 ], if: { type: [ 'ragdoll' ] } },
				swingAxis: { type: 'vector3', default: [ 0, 1, 0 ], if: { type: [ 'ragdoll' ] } },
				maxSwing: { default: Math.PI, if: { type: [ 'ragdoll' ] } },
				linkedMaxSwing: { default: Math.PI, if: { type: [ 'ragdoll' ] } },
				twistSpringDamper: { default: SpringDamper, if: { type: [ 'ragdoll' ] } },
				swingSpringDamper: { default: SpringDamper, if: { type: [ 'ragdoll' ] } },
				twistLimit: { default: AngularLimit, if: { type: [ 'ragdoll' ] } },
				linkedSpringDamper: { default: SpringDamper, if: { type: [ 'universal' ] } },
				linkedAngularLimit: { default: AngularLimit, if: { type: [ 'universal' ] } },
			}
		} );
		this.register( 'rigidbody', Rigidbody, {
			schema: {
				angularVelocity: { type: 'vector3' },
				angularDamping: { default: 0 },
				linearVelocity: { type: 'vector3' },
				linearDamping: { default: 0 },
				gravityScale: { default: 1 },
				autoSleep: { default: true },
				isKinematic: { default: false },
				rotationFactor: { type: 'vector3', default: [ 1, 1, 1 ] },
				mass: { default: 1 }
			}
		} );

	}

	register( type, constructor, config = {} ) {

		if ( this.components.type !== undefined ) throw 'component ' + type + ' already exists';

		if ( config.schema !== undefined ) {

			for ( const name in config.schema ) {

				const prop = config.schema[ name ];

				if ( prop.default === undefined && prop.type === undefined ) {

					throw Error( 'ComponentManager: schema property requires a type or default value' );

				} else if ( prop.default === undefined ) {

					switch ( prop.type ) {

						case 'string':
						case 'asset':
							prop.default = '';
							break;
						case 'color':
							prop.default = '#000000';
							break;
						case 'vector2':
							prop.default = [ 0, 0 ];
							break;
						case 'vector3':
							prop.default = [ 0, 0, 0 ];
							break;
						case 'vector4':
							prop.default = [ 0, 0, 0, 0 ];
							break;
						case 'boolean':
							prop.default = false;
							break;
						case 'slider':
						case 'number':
						case 'int':
							prop.default = 0;
							break;
						case 'select':
							prop.default = prop.select[ 0 ];
							break;
						case 'entity':
							prop.default = null; // uuid of entity
							break;
						case 'class':
							prop.default = {};
						default:
							throw Error( 'ComponentManager: invalid schema property type ' + typeof prop.type );

					}

				} else if ( prop.type === undefined ) {

					switch ( typeof prop.default ) {

						case 'number':
							if ( Number.isInteger( prop.default ) )
								prop.type = 'int';
							else
								prop.type = 'number';
							break;
						case 'string':
							if ( prop.default.length < 10 && prop.default.length > 0 && prop.default[ 0 ] === '#' )
								prop.type = 'string';
							break;
						case 'boolean':
							prop.type = 'boolean';
							break;
						case 'object':
							if ( Array.isArray( prop.default ) )
								prop.type = 'array';
							else throw Error( 'ComponentManager: could not infer property type from default ' + prop.default );
							break;
						case 'function':
							prop.type = 'class';
							break;
						default:
							throw Error( 'ComponentManager: could not infer property type from default ' + prop.default );

					}

				}

				if ( prop.type === 'vector4' )
					prop.default = new Vector4().fromArray( prop.default );
				else if ( prop.type === 'vector3' )
					prop.default = new Vector3().fromArray( prop.default );
				else if ( prop.type === 'vector2' )
					prop.default = new Vector2().fromArray( prop.default );

			}

		}

		this.properties.componentType.value = type;
		Object.defineProperties( constructor.prototype, this.properties );
		Object.assign( constructor.prototype, EventDispatcher.prototype );

		this.components[ type ] = { constructor, config };

	}

}

// config: allowMultiple, dependencies, schema

// schema is an array of objects
// ex: schema: [{name: "velocity", type: "number", default}]
// ex: schema: [{name: "velocity"}]
