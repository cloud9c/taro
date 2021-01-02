import { Physics } from './Physics.js';
import { Renderer } from './Renderer.js';
import { Time } from './Time.js';
import { Scene } from './Scene.js';
import { Input } from './Input.js';

export class Application {

	constructor( parameters = {} ) {

		if ( typeof parameters.canvas === 'string' )
			parameters.canvas = document.getElementById( parameters.canvas );

		this.parameters = parameters;

		this.renderer = new Renderer( parameters );
		this.time = new Time( parameters );
		this.physics = new Physics( parameters );
		this.input = new Input();

		this.autoUpdate = parameters.autoUpdate !== undefined ? parameters.autoUpdate : true;

		this.scenes = [];
		this._currentScene;
		this.requestID;

		if ( parameters.canvas === 'undefined' )
			document.body.appendChild( this.renderer.domElement );

		Application.currentApp = this;

	}

	update( timestamp = 0 ) {

		const deltaTime = this.time._update( timestamp );

		this.physics._update(
			deltaTime,
			this.time.fixedTimestep * this.time.timeScale
		);

		// update loop
		for ( const type in this._containers ) {

			const container = this._containers[ type ];
			if ( container[ 0 ] && container[ 0 ].update !== undefined ) {

				for ( let j = 0, lenj = container.length; j < lenj; j ++ ) {

					container[ j ].update( deltaTime );

				}

			}

		}

		this.renderer._update();
		this.input._reset();

		if ( this.autoUpdate )
			window.requestAnimationFrame( ( t ) => this.update( t / 1000 ) );

	}

	addScene( scene ) {

		scene.app = this;
		this.scenes.push( scene );
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

	findScene( name ) {

		for ( let i = 0, len = this.scenes.length; i < len; i ++ ) {

			if ( this.scenes[ i ].name === name )
				return this.scenes[ i ];

		}

	}

	findSceneById( id ) {

		return this.findSceneByProperty( 'id', id );


	}

	findSceneByProperty( name, value ) {

		for ( let i = 0, len = this.scenes.length; i < len; i ++ ) {

			if ( this.scenes[ i ][ name ] === value )
				return this.scenes[ i ];

		}


	}

	get currentScene() {

		return this._currentScene;

	}

	static getApplication( id ) {

		return Application._apps[ id ];

	}

	toJSON() {

		const data = {
			metadata: {
				type: 'App',
				generator: 'Application.toJSON'
			},
			scenes: [],
			currentScene: this.currentScene.uuid,
			parameters: Object.assign( {}, this.parameters ),
		};

		for ( let i = 0, len = this.scenes.length; i < len; i ++ )
			data.scenes[ i ] = this.scenes[ i ].toJSON();

		if ( data.parameters.canvas.id !== undefined )
			data.parameters.canvas = data.parameters.canvas.id;

		return data;

	}

}

Application.currentApp;
Application.apps = {};
