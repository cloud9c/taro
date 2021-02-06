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

			this.update();

		};

		this.onPointerMove = ( e ) => {

			this.pointerDelta.set( e.movementX, e.movementY );
			this.pointerPosition.set( e.clientX, e.clientY );

		};

		this.onPointerDown = ( e ) => {

			this.pointer[ e.button ] = true;
			this.pointerDown[ e.button ] = true;

		};

		this.onPointerUp = ( e ) => {

			this.pointer[ e.button ] = false;
			this.pointerUp[ e.button ] = true;

		};

		this.onWheel = ( e ) => {

			this.wheelDelta.set( e.deltaX, e.deltaY );

		};

		this.onKeyDown = () => {

			this.key[ event.code ] = true;
			if ( ! event.repeat ) this.keyDown[ event.code ] = true;

		};

		this.onKeyUp = () => {

			this.key[ event.code ] = false;
			this.keyUp[ event.code ] = true;

		};

		window.addEventListener( 'blur', this.onBlur );
		document.addEventListener( 'fullscreenchange', this.onBlur );

		this.domElement.addEventListener( 'pointermove', this.onPointerMove );
		this.domElement.addEventListener( 'pointerdown', this.onPointerDown );
		this.domElement.addEventListener( 'pointerup', this.onPointerUp );
		this.domElement.addEventListener( 'wheel', this.onWheel );

		document.addEventListener( 'keydown', this.onKeyDown );
		document.addEventListener( 'keyup', this.onKeyUp );

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

	getKey( key ) {

		return this.key[ key ] === true;

	}

	getKeyDown( key ) {

		return key in this.keyDown;

	}

	getKeyUp( key ) {

		return key in this.keyUp;

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
