import { Vector2 } from "../lib/three.module.js";

export class Input {
	constructor() {
		this.mousePosition = new Vector2();
		this.mouseDelta = new Vector2();
		this.wheelDelta = new Vector2();
		this._mouse = [];
		this._mouseDown = [];
		this._mouseUp = [];
		this._key = {};
		this._keyDown = {};
		this._keyUp = {};

		window.addEventListener("blur", () => {
			for (const property in Input) {
				if (typeof Input[property] === "boolean")
					Input[property] = false;
				else if (typeof Input[property] === "number")
					Input[property] = 0;
			}
			this.lastTimestamp = undefined;
		});

		document.addEventListener("mousemove", (e) => {
			this.mouseDelta.set(e.movementX, e.movementY);
			this.mousePosition.set(e.clientX, e.clientY);
		});
		document.addEventListener("mousedown", (e) => {
			this._mouse[e.button] = true;
			this._mouseDown[e.button] = true;
		});
		document.addEventListener("mouseup", (e) => {
			this._mouse[e.button] = false;
			this._mouseUp[e.button] = true;
		});

		document.addEventListener("wheel", (e) => {
			this.wheelDelta.set(e.deltaX, e.deltaY);
		});

		document.addEventListener("keydown", () => {
			this._key[event.code] = true;
			this._keyDown[event.code] = true;
		});
		document.addEventListener("keyup", () => {
			this._key[event.code] = false;
			this._keyUp[event.code] = true;
		});
	}
	_reset() {
		for (const prop in this._keyDown) {
			delete this._keyDown[prop];
		}
		for (const prop in this._keyUp) {
			delete this._keyUp[prop];
		}
		this._mouseDown.length = 0;
		this._mouseUp.length = 0;
	}
	getKey(v) {
		return Boolean(this._key[v]);
	}
	getKeyDown(v) {
		return v in this._keyDown;
	}
	getKeyUp(v) {
		return v in this._keyUp;
	}
	getMouse(v) {
		return Boolean(this._mouse[v]);
	}
	getMouseDown(v) {
		return Boolean(this._mouseDown[v]);
	}
	getMouseUp(v) {
		return Boolean(this._mouseUp[v]);
	}
}
