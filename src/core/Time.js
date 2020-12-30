export class Time {

	constructor() {

		this.fixedTimestep = 0.02;
		this.maxDeltaTime = 0.1;
		this.timeScale = 1;
		this.deltaTime = 0;
		this.lastTimestamp = false;

	}
	_update( timestamp ) {

		this.deltaTime =
			( timestamp - ( this.lastTimestamp || timestamp ) ) * this.timeScale;
		const maxDeltaTime = this.maxDeltaTime * this.timeScale;
		if ( this.deltaTime > maxDeltaTime ) this.deltaTime = maxDeltaTime;
		this.lastTimestamp = timestamp;
		return this.deltaTime;

	}

}
