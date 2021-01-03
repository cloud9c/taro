export function Toolbar() {

	function onPointerDown( event ) {

		if ( event.isPrimary === false || event.target.dataset.selected !== undefined ) return;

		delete document.querySelector( '.tool[data-selected]' ).dataset.selected;
		event.target.dataset.selected = '';

	}

	document.getElementById( 'toolbar' ).addEventListener( 'pointerdown', onPointerDown );

}
