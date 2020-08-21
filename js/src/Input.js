const Input = {
	init() {
		document.addEventListener("mousemove", (event) => {
			Input.mouseDeltaX = event.movementX;
			Input.mouseDeltaY = event.movementY;
		});
		document.addEventListener("wheel", () => {
			Input.wheelDeltaX = event.wheelDeltaX;
			Input.wheelDeltaY = event.wheelDeltaY;
		});
		document.addEventListener("keydown", () => {
			if (event.repeat) return;

			Input[event.code] = true;
		});
		document.addEventListener("keyup", () => {
			Input[event.code] = false;
		});
	},
	mouseX: 0,
	mouseY: 0,
	mouseDeltaX: 0,
	mouseDeltaY: 0,
	wheelDeltaX: 0,
	wheelDeltaY: 0,
};

export { Input };
