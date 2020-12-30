export class PhysicMaterial {

	constructor( friction, restitution ) {

		this._friction = friction;
		this._restitution = restitution;
		this._colliders = [];

	}

	get friction() {

		return this._friction;

	}

	get restitution() {

		return this._restitution;

	}

	set friction( v ) {

		this._friction = v;
		for ( let i = 0, len = this._colliders.length; i < len; i ++ ) {

			this._colliders[ i ].setFriction( v );

		}

	}

	set restitution( v ) {

		this._restitution = v;
		for ( let i = 0, len = this._colliders.length; i < len; i ++ ) {

			this._colliders[ i ].setRestitution( v );

		}

	}

}
