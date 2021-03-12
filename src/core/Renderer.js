import { WebGLRenderer } from '../lib/three.module.js';

export class Renderer extends WebGLRenderer {

	constructor( parameters ) {

		super( parameters );

		this.scene = undefined;
		this.cameras = [];

		this.pixelRatio = parameters.pixelRatio !== undefined ? parameters.pixelRatio : window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;

		this._updateCanvas();
		window.addEventListener( 'resize', () => this._updateCanvas() );

	}

	_updateScene( scene ) {

		this.cameras = scene.components.camera;
		this.scene = scene;

	}

	_updateCanvas() {

		const canvas = this.domElement;
		this.setSize( canvas.clientWidth * this.pixelRatio, canvas.clientHeight * this.pixelRatio, false );

		const cameras = this.cameras;

		for ( let i = 0, len = cameras.length; i < len; i ++ )
			cameras[ i ]._updateRegion( canvas );

		this.update();

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

	}

}
