export function Sidebar() {

	function onPointerDown( event ) {

		const target = event.target;

		if ( target.classList.contains( 'tabs' ) || target.dataset.selected !== undefined ) return;

		const tabs = target.parentElement;

		const oldTarget = tabs.querySelector( '[data-selected]' );
		delete oldTarget.dataset.selected;
		document.getElementById( oldTarget.dataset.tab ).style.removeProperty( 'display' );

		target.dataset.selected = '';
		document.getElementById( target.dataset.tab ).style.setProperty( 'display', 'inherit' );

	}

	const tabs = document.getElementsByClassName( 'tabs' );
	for ( let i = 0, len = tabs.length; i < len; i ++ ) {

		tabs[ i ].addEventListener( 'pointerdown', onPointerDown );

	}

}
