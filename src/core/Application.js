import { Physics } from "./Physics.js";
import { Render } from "./Render.js";
import { Time } from "./Time.js";
import { Scene } from "./Scene.js";
import { Input } from "./Input.js";

export class Application {

	constructor( canvas ) {

		this.canvas = document.getElementById( canvas );
		this.time = new Time();
		this.physics = new Physics();
		this.render = new Render( this, {
			canvas: this.canvas,
		} );
		this.input = new Input();

		this._scenes = {};

		Application.currentApp = this;

	}
	start() {

		window.requestAnimationFrame( ( t ) => this._updateLoop( t / 1000 ) );

	}
	createScene( name ) {

		const scene = new Scene();
		scene.app = this;
		this._scenes[ name ] = scene;
		return scene;

	}
	getScene( name ) {

		return this._scenes[ name ];

	}
	setScene( name ) {

		const scene = this._scenes[ name ];

		this.render.scene = this._scene = scene;
		this._containers = scene._containers;

		scene._physicsWorld.setGravity( this.physics._gravity );
		this.physics._world = scene._physicsWorld;
		this.physics.rigidbodies = scene._containers[ "Rigidbody" ];

		this.render.cameras = scene._cameras;
		return scene;

	}
	renameScene( oldName, newName ) {

		const scene = this._scene[ oldName ];
		delete this._scene[ oldName ];
		this._scene[ newName ] = scene;

	}
	get scene() {

		return this._scene;

	}
	get scenes() {

		return Object.assign( {}, this._scenes );

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
