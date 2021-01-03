export function Toolbar( control ) {

	function onPointerDown( event ) {

		if ( event.isPrimary === false || event.target.dataset.selected !== undefined ) return;

		delete document.querySelector( '.tool[data-selected]' ).dataset.selected;
		event.target.dataset.selected = '';
		control.setMode(event.target.dataset.type)

	}

	document.getElementById( 'toolbar' ).addEventListener( 'pointerdown', onPointerDown );

}
