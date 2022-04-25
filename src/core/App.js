import { Physics } from './Physics.js';
import { Renderer } from './Renderer.js';
import { AssetManager } from './AssetManager.js';
import { Time } from './Time.js';
import { Input } from './Input.js';

export class App {

	constructor( parameters = {} ) {

		this.parameters = parameters;

		this.renderer = parameters.renderer !== undefined ? parameters.renderer : new Renderer( parameters );
		this.domElement = this.renderer.domElement;

		this.assets = new AssetManager();
		this.time = new Time( parameters );
		this.physics = new Physics( parameters );
		this.input = new Input( this.domElement );

		this.scenes = [];
		this.currentScene = null;

		App.currentApp = this;

		this.physics.addEventListener( 'preStep', () => {

			for ( const type in this.components ) {

				const container = this.components[ type ];
				if ( container[ 0 ] !== undefined && container[ 0 ].fixedUpdate !== undefined )
					for ( let j = 0, lenj = container.length; j < lenj; j ++ )
						container[ j ].fixedUpdate();

			}

		} );

	}

	start() {

		this.renderer.setAnimationLoop( t => this.update( t ) );

	}

	stop() {

		this.renderer.setAnimationLoop( null );

	}

	update( timestamp = performance.now() ) {

		const deltaTime = this.time.update( timestamp / 1000 );

		this.physics.update( this.time.scaledFixedTimestep, deltaTime );

		// update (once per frame)
		for ( const type in this.components ) {

			const container = this.components[ type ];
			if ( container[ 0 ] !== undefined && container[ 0 ].update !== undefined )
				for ( let j = 0, lenj = container.length; j < lenj; j ++ )
					container[ j ].update( deltaTime );

		}

		this.renderer.update();
		this.input.reset();

	}

	dispose() {

		this.renderer.dispose();
		this.input.dispose();

		const audioArray = this.components[ 'audio' ];
		if ( audioArray !== undefined ) {

			for ( let i = 0, len = audioArray.length; i < len; i ++ ) {

				audioArray[ i ].ref.hasPlaybackControl = true;
				audioArray[ i ].ref.setLoop( false );
				if ( audioArray[ i ].ref.source !== null )
					audioArray[ i ].ref.stop();
				audioArray[ i ].ref.hasPlaybackControl = false;

			}

		}

	}

	addScene( scene ) {

		if ( arguments.length > 1 ) {

			for ( let i = 0; i < arguments.length; i ++ ) {

				this.addScene( arguments[ i ] );

			}

			return this;

		}

		if ( scene.app !== null ) {

			scene.app.removeScene( scene );

		}

		scene.app = this;
		this.scenes.push( scene );
		scene.dispatchEvent( { type: 'appadd' } );

		return this;

	}

	removeScene( scene ) {

		if ( arguments.length > 1 ) {

			for ( let i = 0; i < arguments.length; i ++ ) {

				this.removeScene( arguments[ i ] );

			}

			return this;

		}

		const index = this.scenes.indexOf( scene );

		if ( index !== - 1 ) {

			this.scenes.splice( index, 1 );
			scene.app = null;

		}

		return this;

	}

	setScene( scene ) {

		if ( this.currentScene !== scene ) {

			if ( this.scenes.indexOf( scene ) === - 1 )
				this.addScene( scene );

			this.components = scene.components;
			this.currentScene = scene;

			this.renderer._updateScene( scene );
			this.physics._updateScene( scene );

		}

	}

	getSceneById( id ) {

		return this.getSceneByProperty( 'id', id );

	}

	getSceneByName( name ) {

		return this.getSceneByProperty( 'name', name );

	}

	getSceneByProperty( name, value ) {

		for ( let i = 0, len = this.scenes.length; i < len; i ++ ) {

			if ( this.scenes[ i ][ name ] === value )
				return this.scenes[ i ];

		}

		return undefined;

	}

	toJSON() {

		const output = {
			metadata: {
				'version': 1,
				'type': 'App',
				'generator': 'TaroExporter'
			},
			scenes: [],
			parameters: Object.assign( {}, this.parameters )
		};

		const op = output.parameters;

		// can't jsonify an HTMLelement, so remove it
		delete op.canvas;

		// update physics
		if ( this.physics.allowSleep === false ) op.allowSleep = false;
		if ( this.physics.epsilon !== 0.001 ) op.epsilon = this.parameters.epsilon;
		if ( this.physics.gravity.equals( { x: 0, y: - 9.80665, z: 0 } ) === false ) op.gravity = this.parameters.gravity;
		if ( this.physics.maxSubSteps !== 10 ) op.maxSubSteps = this.parameters.maxSubSteps;

		// update time
		if ( this.time.fixedTimestep !== 0.02 ) op.fixedTimestep = this.parameters.fixedTimestep;
		if ( this.time.maxDeltaTime !== 0.1 ) op.maxDeltaTime = this.parameters.maxDeltaTime;
		if ( this.time.timeScale !== 1 ) op.timeScale = this.parameters.timeScale;

		for ( let i = 0, len = this.scenes.length; i < len; i ++ )
			output.scenes[ i ] = this.scenes[ i ].toJSON();

		output.currentScene = ( this.currentScene !== undefined ) ? this.currentScene.uuid : this.scenes[0].uuid;

		return output;

	}

}

App.prototype.isApp = true;
