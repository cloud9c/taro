import { OIMO } from '../../lib/oimo.js';
import { ConvexHull } from '../../physics/ConvexHull.js';
import { Vector3, Euler } from '../../lib/three.js';
import { Rigidbody } from './Rigidbody.js';

const vector = new Vector3();
const massData = new OIMO.MassData();
const transform = new OIMO.Transform();
const shapeConfig = new OIMO.ShapeConfig();
shapeConfig.contactCallback = {
	beginContact: ( c ) => contactCallback( c, 'collisionenter' ),
	preSolve: ( c ) => contactCallback( c, 'collisionpresolve' ),
	postSolve: ( c ) => contactCallback( c, 'collisionpostsolve' ),
	endContact: ( c ) => contactCallback( c, 'collisionend' ),
};
const config = new OIMO.RigidBodyConfig();
config.type = 1;

const properties = {
	_x: { value: 0, writable: true },
	_y: { value: 0, writable: true },
	_z: { value: 0, writable: true },
	x: {
		get() {

			return this._x;

		},
		set( value ) {

			this._x = value;
			const colliders = this._colliders;
			for ( let i = 0, len = colliders.length; i < len; i ++ ) {

				colliders[ i ]._setShape();

			}

		},
	},
	y: {
		get() {

			return this._y;

		},
		set( value ) {

			this._y = value;
			const colliders = this._colliders;
			for ( let i = 0, len = colliders.length; i < len; i ++ ) {

				colliders[ i ]._setShape();

			}

		},
	},
	z: {
		get() {

			return this._z;

		},
		set( value ) {

			this._z = value;
			const colliders = this._colliders;
			for ( let i = 0, len = colliders.length; i < len; i ++ ) {

				colliders[ i ]._setShape();

			}

		},
	},
};

export class Collider {

	init( data ) {

		const type = this.type = data.type !== undefined ? data.type : 'box';
		this._isTrigger = data.isTrigger !== undefined ? data.isTrigger : false;
		this._collisionGroup = data.collisionGroup !== undefined ? data.collisionGroup : 1;
		this._collisionMask = data.collisionMask !== undefined ? data.collisionMask : 1;
		this._center = data.center !== undefined ? data.center : new Vector3( 0, 0, 0 );
		this._rotation = data.rotation !== undefined ? data.rotation : new Euler( 0, 0, 0 );

		switch ( type ) {

			case 'box':
				this._halfExtents =
					data.halfExtents !== undefined
						? data.halfExtents
						: new Vector( 1, 1, 1 );
				break;
			case 'capsule':
			case 'cone':
			case 'cylinder':
				this._radius = data.radius !== undefined ? data.radius : 0.5;
				this._halfHeight = data.halfHeight !== undefined ? data.halfHeight : 1;
				break;
			case 'mesh':
				this._mesh = data.mesh;
				this._points = data.points;
				break;
			case 'sphere':
				this._radius = data.radius !== undefined ? data.radius : 0.5;
				break;
			default:
				throw new Error( 'Collider: invalid collider type ' + type );

		}

		if ( data.material !== undefined ) this._material = data.material;

		this._setShape();

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );
		this.entity.addEventListener( 'scenechange', this.onSceneChange );

	}

	onEnable() {

		if ( this._isTrigger ) {

			this.app.physics._triggers.push(
				this._shapeRef.getGeometry()
			);

		} else {

			if ( this.entity._physicsRef !== undefined ) {

				const ref = this.entity._physicsRef;
				this._ref = ref;
				if ( ! ref.component._enabled ) {

					this.scene._physicsWorld.addRigidBody( this._ref );

				}

			} else {

				Rigidbody.createRigidbody( this, 1 );
				this.scene._physicsWorld.addRigidBody( this._ref );

			}

			this._ref.addShape( this._shapeRef );
			if ( this._ref.getType() === 0 ) {

				this._ref.getMassDataTo( massData );
				massData.mass = this._ref.mass;
				this._ref.setMassData( massData );

			}

		}

		const scale = this.entity.scale;
		if ( scale._colliders !== undefined ) {

			scale._colliders.push( this );

		} else {

			scale._colliders = [ this ];
			properties._x.value = scale.x;
			properties._y.value = scale.y;
			properties._z.value = scale.z;
			Object.defineProperties( this.entity.scale, properties );

		}

	}

	onDisable() {

		if ( this._isTrigger ) {

			const triggers = this.app.physics._triggers;
			triggers.splice( triggers.indexOf( this._shapeRef.getGeometry() ), 1 );

		} else {

			this._ref.removeShape( this._shapeRef );
			if ( this._ref.getType() === 0 ) {

				this._ref.getMassDataTo( massData );
				massData.mass = this._ref.mass;
				this._ref.setMassData( massData );

			}

			if ( this._ref.getNumShapes() === 0 && this._ref.getType() === 1 ) {

				this.scene._physicsWorld.removeRigidBody( this._ref );

			}

			delete this._ref;
			const scale = this.entity.scale;
			if ( scale._colliders.length === 1 ) {

				Object.defineProperty( this.entity, 'scale', {
					value: new Vector3().copy( scale ),
				} );

			} else {

				scale._colliders.splice( scale._colliders.indexOf( this ), 1 );

			}

		}

	}

	onSceneChange( event ) {

		// need to test
		if ( this._enabled ) {

			if ( this._isTrigger ) {

				const oldTriggers = event.oldScene.app.physics._triggers;
				oldTriggers.splice(
					oldTriggers.indexOf( this._shapeRef.getGeometry() ),
					1
				);
				event.newScene.app.physics._triggers.push(
					this._shapeRef.getGeometry()
				);

			} else {

				this._ref.removeShape( this._shapeRef );
				if (
					this._ref.getNumShapes() === 0 &&
					this._ref.getType() === 1
				) {

					event.oldScene._physicsWorld.removeRigidBody( this._ref );
					event.newScene._physicsWorld.addRigidBody( this._ref );

				}

			}

		}

	}

	_setGeometry( scale, max ) {

		switch ( this.type ) {

			case 'box':
				return new OIMO.BoxGeometry(
					vector.copy( this._halfExtents ).multiply( scale )
				);
			case 'capsule':
				return new OIMO.CapsuleGeometry(
					this._radius * max,
					this._halfHeight * max
				);

			case 'cone':
				return new OIMO.ConeGeometry(
					this._radius * max,
					this._halfHeight * max
				);
			case 'cylinder':
				return new OIMO.CylinderGeometry(
					this._radius * max,
					this._halfHeight * max
				);
			case 'mesh':
				if ( this._points === undefined && this._mesh !== undefined ) {

					this._points = convexHull.setFromObject( this._mesh ).vertices;
					for ( let i = 0, len = this._points.length; i < len; i ++ ) {

						this._points[ i ] = this._points[ i ].point.multiply( scale );

					}

				} else {

					throw 'MeshCollider: points or mesh must be provided';

				}

				return new OIMO.ConvexHullGeometry( this._points );
			case 'sphere':
				return new OIMO.SphereGeometry( this._radius * max );

		}

	}

	_setShape() {

		const scale = this.entity.scale;
		const max = Math.max( scale.x, scale.y, scale.z );

		shapeConfig.geometry = this._setGeometry( scale, max );
		shapeConfig.collisionGroup = this._collisionGroup;
		shapeConfig.collisionMask = this._collisionMask;
		shapeConfig.position = this._center;
		shapeConfig.rotation.fromEulerXyz( this._rotation );

		if ( this._shapeRef !== undefined && this._enabled ) {

			if ( this._isTrigger ) {

				const triggers = this.app.physics._triggers;
				triggers.splice(
					triggers.indexOf( this._shapeRef.getGeometry() ),
					1
				);
				this._shapeRef = new OIMO.Shape( shapeConfig );
				triggers.push( this._shapeRef.getGeometry() );

			} else {

				this._ref.removeShape( this._shapeRef );
				this._shapeRef = new OIMO.Shape( shapeConfig );
				this._ref.addShape( this._shapeRef );

			}

		} else {

			this._shapeRef = new OIMO.Shape( shapeConfig );

		}

		this._shapeRef.entity = this.entity;
		this._shapeRef.collider = this;

		if ( this._material !== undefined ) this.material = this._material;

	}

	get isTrigger() {

		return this._isTrigger;

	}

	set isTrigger( isTrigger ) {

		this.onDisable();
		this._isTrigger = isTrigger;
		this.onEnable();

	}

	get center() {

		return this._center;

	}

	set center( center ) {

		this._center = center;
		this._shapeRef.getLocalTransformTo( transform );
		transform.setPosition( center );
		this._shapeRef.setLocalTransform( transform );

	}

	get rotation() {

		return this._rotation;

	}

	set rotation( rotation ) {

		this._rotation = rotation;
		this._shapeRef.getLocalTransformTo( transform );
		transform.setRotationXyz( rotation );
		this._shapeRef.setLocalTransform( transform );

	}

	get material() {

		return this._material;

	}

	set material( material ) {

		if ( material === null ) {

			this._shapeRef.setFriction( 0.2 );
			this._shapeRef.setRestitution( 0.2 );

		}

		if ( this._material !== undefined ) {

			const colliders = this._material._colliders;
			colliders.splice( colliders.indexOf( this._shapeRef ), 1 );

		}

		material._colliders.push( this._shapeRef );
		this._shapeRef.setFriction( material._friction );
		this._shapeRef.setRestitution( material._restitution );
		this._material = material;

	}

	get volume() {

		return this._shapeRef.getGeometry().getVolume();

	}

	get mesh() {

		return this._mesh;

	}

	set mesh( mesh ) {

		this._mesh = mesh;
		this._setShape();

	}

	getPoints() {

		const points = [];

		for ( let i = 0, len = this._points.length; i < len; i ++ ) {

			points[ i ] = this._points.clone();

		}

		return this._points;

	}

	setPoints( points ) {

		this._points = points;
		this._setShape();

	}

	get halfExtents() {

		return this._halfHeight;

	}

	get halfHeight() {

		return this._halfHeight;

	}

	get radius() {

		return this._radius;

	}

	set halfExtents( v ) {

		this._halfExtents = v;
		this._setShape();

	}

	set halfHeight( v ) {

		this._halfHeight = v;
		this._setShape();

	}

	set radius( v ) {

		this._radius = v;
		this._setShape();

	}

	get bounds() {

		const aabb = this._shapeRef.getAabb();
		return {
			min: aabb.getMin(),
			max: aabb.getMax(),
		};

	}

	get collisionGroup() {

		return this._collisionGroup;

	}

	get collisionMask() {

		return this._collisionMask;

	}

	set collisionGroup( v ) {

		this._collisionGroup = v;
		this._shapeRef.setCollisionGroup( v );

	}

	set collisionMask( v ) {

		this._collisionMask = v;
		this._shapeRef.setCollisionMask( v );

	}

}

function contactCallback( contact, type ) {

	const constraint = contact.getContactConstraint();
	const entity1 = constraint.getShape1().entity;
	const entity2 = constraint.getShape2().entity;

	const has1 = entity1._listeners !== undefined && entity1._listeners[ type ] !== undefined && entity1._listeners[ type ].length !== 0;
	const has2 = entity2._listeners !== undefined && entity2._listeners[ type ] !== undefined && entity2._listeners[ type ].length !== 0;

	if ( has1 || has2 ) {

		const collider1 = constraint.getShape1().collider;
		const collider2 = constraint.getShape2().collider;

		const binormal = new Vector3();
		const normal = new Vector3();
		const tangent = new Vector3();
		const manifold = contact.getManifold();
		manifold.getBinormalTo( binormal );
		manifold.getNormalTo( normal );
		manifold.getTangentTo( tangent );

		const contacts = manifold.getPoints();
		for ( let i = 0, len = contacts.length; i < len; i ++ ) {

			const point = new Vector3();
			const contact = contacts[ i ];
			contact.getPosition1To( point );

			contact.binormalImpulse = contact.getBinormalImpulse();
			contact.depthImpulse = contact.getDepth();
			contact.normalImpulse = contact.getNormalImpulse();
			contact.tangentImpulse = contact.getTangentImpulse();
			contact.point = point;

		}

		const obj = {
			type,
			entity: entity2,
			thisCollider: collider1,
			otherCollider: collider2,
			binormal,
			normal,
			tangent,
			contacts,
		};
		if ( has1 && has2 ) {

			entity1.dispatchEvent( obj );
			obj.entity = entity1;
			obj.thisCollider = collider2;
			obj.thisCollider = collider1;
			entity2.dispatchEvent( obj );

		} else if ( has1 ) {

			entity1.dispatchEvent( obj );

		} else {

			obj.entity = entity1;
			obj.thisCollider = collider2;
			obj.thisCollider = collider1;
			entity2.dispatchEvent( obj );

		}

	}

}
