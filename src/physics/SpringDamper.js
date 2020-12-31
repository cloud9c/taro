export class SpringDamper {

	constructor( frequency = 0, dampingRatio = 0 ) {

		this.frequency = frequency;
		this.dampingRatio = dampingRatio;

	}

	get useSymplecticEuler() {

		return false;

	}

	set( frequency = 0, dampingRatio = 0 ) {

		this.frequency = frequency;
		this.dampingRatio = dampingRatio;

	}

	clone() {

		return this;

	}

}
