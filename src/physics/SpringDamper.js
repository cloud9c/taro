export class SpringDamper {
	constructor(frequency = 0, damping = 0) {
		this.frequency = frequency;
		this.dampingRatio = damping;
		this.useSymplecticEuler = false;
	}

	get damping() {
		return this.dampingRatio;
	}

	set damping(damping) {
		this.dampingRatio = damping;
	}

	set(frequency = 0, damping = 0) {
		this.frequency = frequency;
		this.dampingRatio = damping;
	}

	clone() {
		return this;
	}
}
