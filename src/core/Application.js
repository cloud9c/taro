import { Physics } from './Physics.js';
import { Renderer } from './Renderer.js';
import { Time } from './Time.js';
import { Scene } from './Scene.js';
import { Input } from './Input.js';

export class Application {

	constructor( parameters = {} ) {

		this.parameters = parameters;

		this.renderer = new Renderer( parameters );
		this.time = new Time( parameters );
		this.physics = new Physics( parameters );
		this.input = new Input();

		this.scenes = [];
		this._currentScene;
		this.requestID;

		this.domElement = this.renderer.domElement;

		Application.currentApp = this;

	}

	start() {

		this.renderer.setAnimationLoop( ( t ) => this.update( t ) );

	}

	stop() {

		this.renderer.setAnimationLoop( null );

	}

	update( timestamp = performance.now() ) {

		const deltaTime = this.time.update( timestamp / 1000 );
		this.physics.update( deltaTime, this.time.scaledFixedTimestep );

		for ( const type in this._containers ) {

			const container = this._containers[ type ];
			if ( container[ 0 ] !== undefined && container[ 0 ].update !== undefined )
				for ( let j = 0, lenj = container.length; j < lenj; j ++ )
					container[ j ].update( deltaTime );

		}

		this.renderer.update();
		this.input.update();

	}

	dispose() {

		this.renderer.dispose();

	}

	addScene( scene ) {

		scene.app = this;
		this.scenes.push( scene );
		scene.dispatchEvent( { type: 'appadd' } );
		return scene;

	}

	removeScene( scene ) {

		const index = this.scenes.indexOf( scene );

		if ( index !== - 1 ) {

			this.scenes.splice( index, 1 );
			delete scene.app;

		}

	}

	setScene( scene ) {

		if ( this.scenes.indexOf( scene ) === - 1 )
			this.addScene( scene );

		this.renderer.scene = this._currentScene = scene;
		this._containers = scene._containers;

		this.physics._updateScene( scene );

		this.renderer.cameras = scene._cameras;
		return scene;

	}

	getSceneByName( name ) {

		for ( let i = 0, len = this.scenes.length; i < len; i ++ ) {

			if ( this.scenes[ i ].name === name )
				return this.scenes[ i ];

		}

	}

	getSceneById( id ) {

		return this.findSceneByProperty( 'id', id );


	}

	get currentScene() {

		return this._currentScene;

	}

	static getApplication( id ) {

		return Application._apps[ id ];

	}

}

Application.currentApp;
Application.apps = {};
