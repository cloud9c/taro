export class Time {

	constructor( parameters ) {

		this.fixedTimestep = parameters.fixedTimestep !== undefined ? parameters.fixedTimestep : 0.02;
		this.maxDeltaTime = parameters.maxDeltaTime !== undefined ? parameters.maxDeltaTime : 0.1;
		this.timeScale = parameters.timeScale !== undefined ? parameters.timeScale : 1;

		this.deltaTime = 0;
		this.lastTimestamp = false;
		this.scaledFixedTimestep = 0;

	}
	update( timestamp ) {

		this.deltaTime = ( timestamp - this.lastTimestamp ) * this.timeScale;

		const scaledMaxDeltaTime = this.maxDeltaTime * this.timeScale;
		if ( this.deltaTime > scaledMaxDeltaTime ) this.deltaTime = scaledMaxDeltaTime;

		this.lastTimestamp = timestamp;

		this.scaledFixedTimestep = this.fixedTimestep * this.timeScale;

		return this.deltaTime;

	}

}
