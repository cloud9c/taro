import { WebGLRenderer } from "../lib/three.js";

export class Render extends WebGLRenderer {

	constructor( app, parameters ) {

		super( parameters );
		this.canvas = app.canvas;

		this.setPixelRatio( window.devicePixelRatio );
		this._onResize();

		new ResizeObserver( () => this._onResize() ).observe( this.canvas );

	}
	_onResize() {

		const canvas = this.canvas;
		this.setSize( canvas.clientWidth, canvas.clientHeight, false );
		if ( "cameras" in this ) {

			for ( let i = 0, len = this.cameras.length; i < len; i ++ ) {

				const camera = this.cameras[ i ];
				camera._onResize( canvas );

			}

		}

	}
	_update() {

		for ( let i = 0, len = this.cameras.length; i < len; i ++ ) {

			const camera = this.cameras[ i ];

			this.setViewport( camera._region );
			this.setScissor( camera._region );
			this.setScissorTest( true );

			this.render( this.scene, this.cameras[ i ] );

		}

	}

}
