import { Vector2 } from '../lib/three.module.js';

export class Input {

	constructor() {

		this.pointerPosition = new Vector2();
		this.pointerDelta = new Vector2();
		this.wheelDelta = new Vector2();
		this._pointer = [];
		this._pointerDown = [];
		this._pointerUp = [];
		this._key = {};
		this._keyDown = {};
		this._keyUp = {};

		this.onBlur = () => {

			this.update();

		};

		this.onPointerMove = ( e ) => {

			this.pointerDelta.set( e.movementX, e.movementY );
			this.pointerPosition.set( e.clientX, e.clientY );

		};

		this.onPointerDown = ( e ) => {

			this._pointer[ e.button ] = true;
			this._pointerDown[ e.button ] = true;

		};

		this.onPointerUp = ( e ) => {

			this._pointer[ e.button ] = false;
			this._pointerUp[ e.button ] = true;

		};

		this.onWheel = ( e ) => {

			this.wheelDelta.set( e.deltaX, e.deltaY );

		};

		this.onKeyDown = () => {

			this._key[ event.code ] = true;
			if ( ! event.repeat ) this._keyDown[ event.code ] = true;

		};

		this.onKeyUp = () => {

			this._key[ event.code ] = false;
			this._keyUp[ event.code ] = true;

		};

		window.addEventListener( 'blur', this.onBlur );
		document.addEventListener( 'fullscreenchange', this.onBlur );
		document.addEventListener( 'pointermove', this.onPointerMove );
		document.addEventListener( 'pointerdown', this.onPointerDown );
		document.addEventListener( 'pointerup', this.onPointerUp );
		document.addEventListener( 'wheel', this.onWheel );
		document.addEventListener( 'keydown', this.onKeyDown );
		document.addEventListener( 'keyup', this.onKeyUp );

	}

	update() {

		for ( const prop in this._keyDown ) {

			delete this._keyDown[ prop ];

		}

		for ( const prop in this._keyUp ) {

			delete this._keyUp[ prop ];

		}

		this._pointerDown.length = 0;
		this._pointerUp.length = 0;
		this.pointerDelta.set( 0, 0 );
		this.wheelDelta.set( 0, 0 );

	}

	getKey( key ) {

		return this._key[ key ] === true;

	}

	isKeyDown( key ) {

		return key in this._keyDown;

	}

	isKeyUp( key ) {

		return key in this._keyUp;

	}

	getPointer( button ) {

		return this._pointer[ button ] === true;

	}

	isPointerDown( button ) {

		return this._pointerDown[ button ] === true;

	}

	isPointerUp( button ) {

		return this._pointerUp[ button ] === true;

	}

	dispose() {

		window.removeEventListener( 'blur', this.onBlur );
		document.removeEventListener( 'fullscreenchange', this.onBlur );
		document.removeEventListener( 'pointermove', this.onPointerMove );
		document.removeEventListener( 'pointerdown', this.onPointerDown );
		document.removeEventListener( 'pointerup', this.onPointerUp );
		document.removeEventListener( 'wheel', this.onWheel );
		document.removeEventListener( 'keydown', this.onKeyDown );
		document.removeEventListener( 'keyup', this.onKeyUp );

	}

}
