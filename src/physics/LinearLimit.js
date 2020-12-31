export class LinearLimit {

	constructor( lowerLimit = 0, upperLimit = 0, motorSpeed, motorForce = 0 ) {

		this.lowerLimit = lowerLimit;
		this.upperLimit = upperLimit;
		this.motorSpeed = motorSpeed;
		this.motorForce = motorForce;

	}

	set( lowerLimit = 0, upperLimit = 0, motorSpeed, motorForce = 0 ) {

		this.lowerLimit = lowerLimit;
		this.upperLimit = upperLimit;
		this.motorSpeed = motorSpeed;
		this.motorForce = motorForce;

	}

	clone() {

		return this;

	}

}
