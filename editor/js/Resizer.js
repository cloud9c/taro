export function Resizer() {

	let id;

	function onPointerDown( event ) {

		if ( event.isPrimary === false ) return;
		id = this.id;

		this.ownerDocument.addEventListener(
			'pointermove',
			onPointerMove,
			false
		);
		this.ownerDocument.addEventListener( 'pointerup', onPointerUp, false );

		this.ownerDocument.body.style.cursor = 'e-resize';

	}

	function onPointerUp( event ) {

		if ( event.isPrimary === false ) return;

		const resizer = document.getElementById( id );

		resizer.ownerDocument.removeEventListener( 'pointermove', onPointerMove );
		resizer.ownerDocument.removeEventListener( 'pointerup', onPointerUp );

		resizer.ownerDocument.body.style.cursor = '';

	}

	function onPointerMove( event ) {

		event.preventDefault();
		if ( event.isPrimary === false ) return;

		const parent = document.getElementById( id ).parentElement;
		const rect = parent.getBoundingClientRect();
		let x = event.movementX;

		if ( id === 'right-resizer' ) x *= - 1;

		parent.style.width = x + rect.width + 'px';

	}

	const resizers = document.getElementsByClassName( 'resizer' );
	for ( let i = 0, len = resizers.length; i < len; i ++ ) {

		resizers[ i ].addEventListener( 'pointerdown', onPointerDown );

	}

}
