import { Physics } from "./Physics.js";
import { Render } from "./Render.js";
import { Time } from "./Time.js";
import { Scene } from "./Scene.js";
import { Input } from "./Input.js";

export class Application {

	constructor( parameters = {} ) {

		if ( typeof parameters.canvas === "string" )
			parameters.canvas = document.getElementById( parameters.canvas );

		this.parameters = parameters;

		this.render = new Render( parameters );
		this.time = new Time( parameters );
		this.physics = new Physics( parameters );
		this.input = new Input();
		this.scenes = [];
		this._currentScene;

		Application.currentApp = this;

	}

	start() {

		window.requestAnimationFrame( ( t ) => this._updateLoop( t / 1000 ) );

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

		this.render.scene = this._currentScene = scene;
		this._containers = scene._containers;

		this.physics._updateScene( scene );

		this.render.cameras = scene._cameras;
		return scene;

	}

	findScene( name ) {

		for ( let i = 0, len = this.scenes.length; i < len; i ++ ) {

			if ( this.scenes[ i ].name === name )
				return this.scenes[ i ];

		}

	}

	findSceneById( id ) {

		return this.findSceneByProperty( "id", id );


	}

	findSceneByProperty( name, value ) {

		for ( let i = 0, len = this.scenes.length; i < len; i ++ ) {

			if ( this.scenes[ i ][ name ] === value )
				return this.scenes[ i ];

		}


	}

	_updateLoop( timestamp ) {

		const deltaTime = this.time._update( timestamp );

		this.physics._update(
			deltaTime,
			this.time.fixedTimestep * this.time.timeScale
		);

		// update loop
		for ( const type in this._containers ) {

			const container = this._containers[ type ];
			if ( container[ 0 ] && "update" in container[ 0 ] ) {

				for ( let j = 0, lenj = container.length; j < lenj; j ++ ) {

					container[ j ].update( deltaTime );

				}

			}

		}

		this.render._update();
		this.input._reset();

		window.requestAnimationFrame( ( t ) => this._updateLoop( t / 1000 ) );

	}

	get currentScene() {

		return this._currentScene;

	}

	static getApplication( id ) {

		return Application._apps[ id ];

	}

	toJSON() {

		const data = {
			scenes: [],
			currentScene: this.currentScene.uuid,
			parameters: Object.assign( {}, this.parameters ),
		};

		for ( let i = 0, len = this.scenes.length; i < len; i ++ )
			data.scenes[ i ] = this.scenes[ i ].toJSON();

		data.parameters.canvas = data.parameters.canvas.id;

		return data;

	}

}

Application.currentApp;
Application.apps = {};
