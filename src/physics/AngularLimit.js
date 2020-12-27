export class AngularLimit {
	constructor(lowerLimit = 1, upperLimit = 0, targetSpeed, maxTorque = 0) {
		this.lowerLimit = lowerLimit;
		this.upperLimit = upperLimit;
		this.motorSpeed = targetSpeed;
		this.motorTorque = maxTorque;
	}
	get targetSpeed() {
		return this.motorSpeed;
	}
	set targetSpeed(targetSpeed) {
		this.motorSpeed = targetSpeed;
	}
	get maxTorque() {
		return this.motorTorque;
	}
	set maxTorque(maxTorque) {
		this.motorTorque = maxTorque;
	}

	set(lowerLimit = 1, upperLimit = 0, targetSpeed, maxTorque = 0) {
		this.lowerLimit = lowerLimit;
		this.upperLimit = upperLimit;
		this.motorSpeed = targetSpeed;
		this.motorTorque = maxTorque;
	}

	clone() {
		return this;
	}
}
