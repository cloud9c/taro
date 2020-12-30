export function Toolbar() {
	let id;

	function onPointerDown(event) {
		if (event.isPrimary === false) return;

		const element = document.querySelector(".tool[data-selected]");
		if (element !== null) {
			delete element.dataset.selected;
		}

		event.target.dataset.selected = "";
	}

	document
		.getElementById("toolbar")
		.addEventListener("pointerdown", onPointerDown);
}
