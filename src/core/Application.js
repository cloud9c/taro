import { Physics } from "./Physics.js";
import { Render } from "./Render.js";
import { Time } from "./Time.js";
import { Scene } from "./Scene.js";
import { Input } from "./Input.js";

export class Application {

	constructor( canvas, parameters ) {

		this.canvas = document.getElementById( canvas );
		this.time = new Time();
		this.physics = new Physics();
		this.render = new Render( this, parameters );
		this.input = new Input();
		this.scenes = [];

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

		this.render.scene = this._scene = scene;
		this._containers = scene._containers;

		scene._physicsWorld.setGravity( this.physics._gravity );
		this.physics._world = scene._physicsWorld;
		this.physics.rigidbodies = scene._containers[ "Rigidbody" ];

		this.render.cameras = scene._cameras;
		return scene;

	}

	findScene( name ) {

		for ( let i = 0, len = this._scenes.length; i < len; i ++ ) {

			if ( this._scenes[ i ].name === name )
				return this._scenes[ i ];

		}

	}

	findSceneById( id ) {

		for ( let i = 0, len = this._scenes.length; i < len; i ++ ) {

			if ( this._scenes[ i ].id === id )
				return this._scenes[ i ];

		}


	}

	get currentScene() {

		return this._scene;

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
	static getApplication( id ) {

		return Application._apps[ id ];

	}

}

Application.currentApp;
Application.apps = {};
