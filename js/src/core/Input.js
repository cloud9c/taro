import { Vector2 } from "../lib/three.module.js";

export const Input = {
	_reset() {
		for (const prop in this._keyDown) {
			delete this._keyDown[prop];
		}
		for (const prop in this._keyUp) {
			delete this._keyUp[prop];
		}
		this._mouseDown.length = 0;
		this._mouseUp.length = 0;
	},
	getKey(v) {
		return Boolean(this._key[v]);
	},
	getKeyDown(v) {
		return v in this._keyDown;
	},
	getKeyUp(v) {
		return v in this._keyUp;
	},
	getMouse(v) {
		return Boolean(this._mouse[v]);
	},
	getMouseDown(v) {
		return Boolean(this._mouseDown[v]);
	},
	getMouseUp(v) {
		return Boolean(this._mouseUp[v]);
	},
	mousePosition: new Vector2(),
	mouseDelta: new Vector2(),
	wheelDelta: new Vector2(),
	_mouse: [],
	_mouseDown: [],
	_mouseUp: [],
	_key: {},
	_keyDown: {},
	_keyUp: {},
};

window.addEventListener("blur", () => {
	Input._reset();
});

document.addEventListener("mousemove", (e) => {
	Input.mouseDelta.set(e.movementX, e.movementY);
	Input.mousePosition.set(e.clientX, e.clientY);
});
document.addEventListener("mousedown", (e) => {
	Input._mouse[e.button] = true;
	Input._mouseDown[e.button] = true;
});
document.addEventListener("mouseup", (e) => {
	Input._mouse[e.button] = false;
	Input._mouseUp[e.button] = true;
});

document.addEventListener("wheel", (e) => {
	Input.wheelDelta.set(e.deltaX, e.deltaY);
});

document.addEventListener("keydown", () => {
	Input._key[event.code] = true;
	Input._keyDown[event.code] = true;
});
document.addEventListener("keyup", () => {
	Input._key[event.code] = false;
	Input._keyUp[event.code] = true;
});
