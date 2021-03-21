import { ComponentManager } from '../../core/ComponentManager.js';
import { Body, Spring as CannonSpring } from '../../lib/cannon-es.js';

const DEFAULT_CONNECTED_BODY = new Body();

class Spring {

	init( data ) {

		const bodyA = this.entity.getComponent( 'rigidbody' ).ref;
		let bodyB;

		if ( data.connectedBody !== null ) {

			bodyB = data.connectedBody.getComponent( 'rigidbody' );
			if ( bodyB === undefined )
				bodyB = data.connectedBody.addComponent( 'rigidbody' );
			bodyB = bodyB.ref;

		} else {

			bodyB = DEFAULT_CONNECTED_BODY;

		}

		this.ref = new CannonSpring( bodyA, bodyB, {
			restLength: data.restLength,
			stiffness: data.stiffness,
			damping: data.damping,
			localAnchorA: data.anchor,
			localAnchorB: data.connectedAnchor,
		} );

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.app.physics.springs.push( this.ref );

	}

	onDisable() {

		const springs = this.app.physics.springs;
		springs.splice( springs.indexOf( this.ref ), 1 );

	}

}

Spring.config = {
	schema: {
		connectedBody: { type: 'entity' },
		restLength: { default: 1, min: 0 },
		stiffness: { default: 100, min: 0 },
		damping: { default: 1, min: 0 },
		anchor: { type: 'vector3' },
		connectedAnchor: { type: 'vector3' },
	},
	dependencies: [ 'rigidbody' ]
};

ComponentManager.registerComponent( 'spring', Spring );
