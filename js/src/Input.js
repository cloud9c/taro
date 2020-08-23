import { Vector2 } from "./math/Vector2.js";

const Input = {
	_init() {
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

export { Input };
