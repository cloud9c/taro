import { ComponentManager } from '../../core/ComponentManager.js';
import { Body, Vec3, DistanceConstraint, PointToPointConstraint, ConeTwistConstraint, LockConstraint, HingeConstraint } from '../../lib/cannon-es.js';
import { MathUtils } from '../../lib/three.module.js';

const DEFAULT_CONNECTED_BODY = new Body();

class Constraint {

	init( data ) {

		const bodyA = this.entity.getComponent( 'rigidbody' ).ref;
		let bodyB;

		if ( data.connectedBody !== null ) {

			bodyB = data.connectedBody.getComponent( 'rigidbody' );
			if ( bodyB === undefined ) {

				bodyB = data.connectedBody.addComponent( 'rigidbody' ).ref;

			} else {

				bodyB = bodyB.ref;

			}

		} else {

			bodyB = DEFAULT_CONNECTED_BODY;

		}

		this.type = data.type;
		
		switch ( this.type ) {

			case 'distance':
				this.ref = new DistanceConstraint( bodyA, bodyB, data.distance, data.maxForce );
				break;
			case 'point':
				this.ref = new PointToPointConstraint( bodyA, data.pivot, bodyB, data.connectedPivot, data.maxForce );
				break;
			case 'coneTwist':
				this.ref = new ConeTwistConstraint( bodyA, bodyB, {
					pivotA: data.pivot,
					pivotB: data.connectedPivot,
					axisA: new Vec3().copy( data.axis ),
					axisB: new Vec3().copy( data.connectedAxis ),
					maxForce: data.maxForce,
					angle: data.angle,
					twistAngle: data.twistAngle,
				} );
				break;
			case 'lock':
				this.ref = new LockConstraint( bodyA, bodyB, {
					maxForce: data.maxForce,
				} );
				break;
			case 'hinge':
				this.ref = new HingeConstraint( bodyA, bodyB, {
					pivotA: data.pivot,
					pivotB: data.connectedPivot,
					axisA: new Vec3().copy( data.axis ),
					axisB: new Vec3().copy( data.connectedAxis ),
					maxForce: data.maxForce,
				} );
				break;
			default:
				console.error( 'Constraint: invalid constraint type ' + this.type );

		}

		this.ref.collideConnected = data.collideConnected;

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.app.physics.addConstraint( this.ref );

	}

	onDisable() {

		this.app.physics.removeConstraint( this.ref );

	}

}

Constraint.config = {
	schema: {
		type: { type: 'select', default: 'distance', select: [ 'distance', 'point', 'coneTwist', 'lock', 'hinge' ] },
		connectedBody: { type: 'entity' },

		distance: { default: 1, if: { type: [ 'distance' ] } },

		pivot: { type: 'vector3', if: { type: [ 'point', 'coneTwist', 'hinge' ] } },
		connectedPivot: { type: 'vector3', if: { type: [ 'point', 'coneTwist', 'hinge' ] } },

		axis: { type: 'vector3', if: { type: [ 'coneTwist', 'hinge' ] } },
		connectedAxis: { type: 'vector3', if: { type: [ 'coneTwist', 'hinge' ] } },
		angle: { default: 0, angle: 'deg', if: { type: [ 'coneTwist' ] } },
		twistAngle: { default: 0, angle: 'deg', if: { type: [ 'coneTwist' ] } },

		maxForce: { type: 'number', default: 1e6, min: 0 },
		collideConnected: { default: true },

	},
	dependencies: [ 'rigidbody' ]
};

// TODO: Research how to implement Trimesh type
ComponentManager.registerComponent( 'constraint', Constraint );
