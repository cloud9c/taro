import { WebGLRenderer } from '../lib/three.module.js';

export class Renderer extends WebGLRenderer {

	constructor( parameters ) {

		super( parameters );

		this.cameras = [];
		this.setPixelRatio( window.devicePixelRatio );
		this._onResize();

		this.observer = new ResizeObserver( () => this._onResize() );
		this.observer.observe( this.domElement );

	}

	_onResize() {

		const canvas = this.domElement;
		this.setSize( canvas.clientWidth, canvas.clientHeight, false );

		for ( let i = 0, len = this.cameras.length; i < len; i ++ ) {

			const camera = this.cameras[ i ];
			camera._updateRegion( canvas );

		}

		this.update();

	}

	update() {

		for ( let i = 0, len = this.cameras.length; i < len; i ++ ) {

			const camera = this.cameras[ i ];

			this.setViewport( camera._region );
			this.setScissor( camera._region );
			this.setScissorTest( true );

			this.render( this.scene, camera.ref );

		}

	}

	dispose() {

		super.dispose();
		this.observer.disconnect();

	}

}
