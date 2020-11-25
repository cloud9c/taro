export class Time {
	constructor() {
		this.fixedTimestep = 0.02;
		this.maxTimestep = 0.25;
		this._timeScale = 1;
		this.deltaTime = 0;
		this.lastTimestamp = 0;
	}
	get timeScale() {
		return this._timeScale;
	}
	set timeScale(timeScale) {
		this.fixedTimestep /= this._timeScale;
		this.maxTimestep /= this._timeScale;
		this._timeScale = timeScale;
		this.fixedTimestep *= this._timeScale;
		this.maxTimestep *= this._timeScale;
	}
	_update(timestamp) {
		this.deltaTime = (timestamp - this.lastTimestamp) * this._timeScale;
		if (this.deltaTime > this.maxTimestep)
			this.deltaTime = this.maxTimestep;
		this.lastTimestamp = timestamp;
	}
}
