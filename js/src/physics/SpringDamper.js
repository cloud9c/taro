export class SpringDamper {
	constructor(damping = 0, frequency = 0) {
		this.dampingRatio = damping;
		this.frequency = frequency;
		this.useSymplecticEuler = false;
	}

	get damping() {
		return this.dampingRatio;
	}

	set damping(damping) {
		this.dampingRatio = damping;
	}
}
