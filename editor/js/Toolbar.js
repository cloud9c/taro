export function Toolbar( editor ) {

	const control = editor.viewport.control;

	function onPointerDown( event ) {

		const target = event.target;

		if ( event.isPrimary === false || target.dataset.selected !== undefined ) return;

		delete document.querySelector( '.tool[data-selected]' ).dataset.selected;
		target.dataset.selected = '';
		control.setMode( target.dataset.type );

	}

	document.getElementById( 'toolbar' ).addEventListener( 'pointerdown', onPointerDown );

}
