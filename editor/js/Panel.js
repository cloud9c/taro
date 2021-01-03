export function Toolbar() {
	let id;

	function onPointerDown(event) {
		if (event.isPrimary === false) return;

		delete document.querySelector(".tool[data-selected]").dataset.selected;
		event.target.dataset.selected = "";
	}

	document
		.getElementById("toolbar")
		.addEventListener("pointerdown", onPointerDown);
}
