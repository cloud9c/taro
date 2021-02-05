import { WebGLRenderer } from '../lib/three.module.js';

export class Renderer extends WebGLRenderer {

	constructor( parameters ) {

		super( parameters );

		this.scene = undefined;
		this.cameras = {};

		this.setPixelRatio( window.devicePixelRatio );

		this.observer = new ResizeObserver( () => this._onResize() );
		this.observer.observe( this.domElement );

	}

	_onResize() {

		const canvas = this.domElement;
		this.setSize( canvas.clientWidth, canvas.clientHeight, false );

		const cameras = this.cameras;

		for ( let i = 0, len = cameras.length; i < len; i ++ )
			cameras[ i ]._updateRegion( canvas );

		this.update();

	}

	_updateScene( scene ) {

		this.cameras = scene.components.camera;
		this.scene = scene;

	}

	update() {

		const cameras = this.cameras;

		for ( let i = 0, len = cameras.length; i < len; i ++ ) {

			const camera = cameras[ i ];

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
