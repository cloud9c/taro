export class AngularLimit {

	constructor( lowerLimit = 1, upperLimit = 0, motorSpeed, motorTorque = 0 ) {

		this.lowerLimit = lowerLimit;
		this.upperLimit = upperLimit;
		this.motorSpeed = motorSpeed;
		this.motorTorque = motorTorque;

	}

	set( lowerLimit = 1, upperLimit = 0, motorSpeed, motorTorque = 0 ) {

		this.lowerLimit = lowerLimit;
		this.upperLimit = upperLimit;
		this.motorSpeed = motorSpeed;
		this.motorTorque = motorTorque;

	}

	clone() {

		return this;

	}

}
