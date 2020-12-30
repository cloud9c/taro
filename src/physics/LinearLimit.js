export class LinearLimit {

	constructor( lowerLimit = 0, upperLimit = 0, targetSpeed, maxForce = 0 ) {

		this.lowerLimit = lowerLimit;
		this.upperLimit = upperLimit;
		this.motorSpeed = targetSpeed;
		this.motorForce = maxForce;

	}
	get targetSpeed() {

		return this.motorSpeed;

	}
	set targetSpeed( targetSpeed ) {

		this.motorSpeed = targetSpeed;

	}
	get maxForce() {

		return this.motorForce;

	}
	set maxForce( maxForce ) {

		this.motorForce = maxForce;

	}

	set( lowerLimit = 0, upperLimit = 0, targetSpeed, maxForce = 0 ) {

		this.lowerLimit = lowerLimit;
		this.upperLimit = upperLimit;
		this.motorSpeed = targetSpeed;
		this.motorForce = maxForce;

	}

	clone() {

		return this;

	}

}
