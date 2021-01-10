export function SidebarInspector( editor ) {

	const componentManager = editor.app.componentManager;
	let currentEntity;


	this.attach = function ( entity ) {

		currentEntity = entity;

	};

	this.detach = function () {

		currentEntity = null;

	};

}
