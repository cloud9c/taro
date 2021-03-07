import { Vector2, EventDispatcher } from '../lib/three.module.js';

export class Input extends EventDispatcher {

	constructor( domElement ) {

		super();

		this.domElement = domElement;

		this.pointerPosition = new Vector2();
		this.pointerDelta = new Vector2();
		this.wheelDelta = new Vector2();

		this.pointer = [];
		this.pointerDown = [];
		this.pointerUp = [];

		this.key = {};
		this.keyDown = {};
		this.keyUp = {};

		this.onBlur = () => {

			this.reset();

		};

		this.onPointerMove = ( e ) => {

			this.pointerDelta.set( e.movementX, e.movementY );
			this.pointerPosition.set( e.clientX, e.clientY );

			this.dispatchEvent( { type: 'pointermove',
				delta: this.pointerDelta,
				position: this.pointerPosition
			} );

		};

		this.onPointerDown = ( e ) => {

			const button = e.button;

			this.pointer[ button ] = true;
			this.pointerDown[ button ] = true;

			this.dispatchEvent( { type: 'pointerdown', button } );

		};

		this.onPointerUp = ( e ) => {

			const button = e.button;

			this.pointer[ button ] = false;
			this.pointerUp[ button ] = true;

			this.dispatchEvent( { type: 'pointerup', button } );

		};

		this.onWheel = ( e ) => {

			this.wheelDelta.set( e.deltaX, e.deltaY );

			this.dispatchEvent( {
				type: 'wheel',
				delta: this.wheelDelta,
			} );

		};

		this.onKeyDown = ( e ) => {

			const code = e.code;

			this.key[ code ] = true;
			if ( ! e.repeat ) this.keyDown[ code ] = true;

			this.dispatchEvent( { type: 'keydown', code } );

		};

		this.onKeyUp = ( e ) => {

			const code = e.code;

			this.key[ code ] = false;
			this.keyUp[ code ] = true;

			this.dispatchEvent( { type: 'keyup', code } );

		};

		window.addEventListener( 'blur', this.onBlur );

		this.domElement.addEventListener( 'pointerdown', this.onPointerDown );
		this.domElement.addEventListener( 'wheel', this.onWheel );

		this.domElement.ownerDocument.addEventListener( 'pointermove', this.onPointerMove );
		this.domElement.ownerDocument.addEventListener( 'pointerup', this.onPointerUp );

		this.domElement.addEventListener( 'keydown', this.onKeyDown );
		this.domElement.addEventListener( 'keyup', this.onKeyUp );

	}

	reset() {

		for ( const prop in this.keyDown )
			delete this.keyDown[ prop ];


		for ( const prop in this.keyUp )
			delete this.keyUp[ prop ];

		this.pointerDown.length = 0;
		this.pointerUp.length = 0;

		this.pointerDelta.set( 0, 0 );
		this.wheelDelta.set( 0, 0 );

	}

	getKey( code ) {

		return this.key[ code ] === true;

	}

	getKeyDown( code ) {

		return code in this.keyDown;

	}

	getKeyUp( code ) {

		return code in this.keyUp;

	}

	getPointer( button ) {

		return this.pointer[ button ] === true;

	}

	getPointerDown( button ) {

		return this.pointerDown[ button ] === true;

	}

	getPointerUp( button ) {

		return this.pointerUp[ button ] === true;

	}

	dispose() {

		window.removeEventListener( 'blur', this.onBlur );
		document.removeEventListener( 'fullscreenchange', this.onBlur );

		this.domElement.removeEventListener( 'pointermove', this.onPointerMove );
		this.domElement.removeEventListener( 'pointerdown', this.onPointerDown );
		this.domElement.removeEventListener( 'pointerup', this.onPointerUp );
		this.domElement.removeEventListener( 'wheel', this.onWheel );

		document.removeEventListener( 'keydown', this.onKeyDown );
		document.removeEventListener( 'keyup', this.onKeyUp );

	}

}
