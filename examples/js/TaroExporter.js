import { ComponentManager } from '../../build/taro.module.js';

export class TaroExporter {

	parse( object ) {

		if ( object.isApp )
			return this.parseApplication( object );
		else if ( object.isScene )
			return this.parseScene( object );
		else
			return this.parseEntity( object );

	}

	parseApp( app ) {

		const data = {
			metadata: {
				'version': 1,
				'type': 'App',
				'generator': 'TaroExporter'
			},
			scenes: [],
			parameters: Object.assign( {}, app.parameters )
		};

		if ( app.currentScene !== undefined )
			data.currentScene = app.currentScene.uuid;

		// cant jsonify an HTMLelement, so remove it
		delete data.parameters.canvas;

		for ( let i = 0, len = app.scenes.length; i < len; i ++ )
			data.scenes[ i ] = this.parseScene( app.scenes[ i ] );

		return data;

	}

	parseScene( scene ) {

		const data = {};

		data.uuid = scene.uuid;
		if ( scene.background !== null ) data.background = scene.background.toJSON();
		if ( scene.environment !== null ) data.environment = scene.environment.toJSON();
		if ( scene.fog !== null ) data.fog = scene.fog.toJSON();

		const children = scene.getEntities();
		if ( children.length > 0 ) {

			data.children = [];
			for ( let i = 0, len = children.length; i < len; i ++ )
				data.children.push( this.parseEntity( children[ i ] ) );

		}

		return data;

	}

	parseEntity( entity, reorder ) {

		const data = {};

		data.uuid = entity.uuid;
		data.matrix = entity.matrix.toArray();

		if ( entity.name !== '' ) data.name = entity.name;
		if ( entity.castShadow === true ) data.castShadow = true;
		if ( entity.receiveShadow === true ) data.receiveShadow = true;
		if ( entity.visible === false ) entity.visible = false;
		if ( entity._enabled === false ) data.enabled = false;

		if ( entity.componentData !== undefined ) {

			const array = JSON.parse( JSON.stringify( entity.componentData ) );
			if ( reorder === false ) {

				data.components = array;

			} else {

				data.components = [];

				// sorting array to place non-dependency components last
				array.sort( ( a, b ) => {

					const dependenciesA = ComponentManager.components[ a.type ].config.dependencies;
					const dependenciesB = ComponentManager.components[ b.type ].config.dependencies;

					if ( dependenciesA === undefined )
						return 1;
					else if ( dependenciesB === undefined )
						return - 1;
					return 0;

				} );

				while ( array.length > 0 ) {

					let i = array.length;

					while ( i -- ) {

						const dependencies = ComponentManager.components[ array[ i ].type ].config.dependencies;

						if ( dependencies !== undefined ) {

							let wait = false;
							for ( let j = 0, len = dependencies.length; j < len; j ++ ) {

								if ( array.includes( dependencies[ j ] ) ) {

									wait = true;
									break;

								}

							}

							if ( wait === true ) {

								continue;

							}

						}

						data.components.push( array[ i ] );
						array.splice( i, 1 );

					}

				}

			}

		}

		const children = entity.getEntities();
		if ( children.length > 0 ) {

			data.children = [];
			for ( let i = 0, len = children.length; i < len; i ++ )
				data.children.push( this.parseEntity( children[ i ] ) );

		}

		return data;

	}

}
