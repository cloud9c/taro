import { EventDispatcher, Vector4, Vector3, Vector2, Color } from '../lib/three.module.js';

export function registerComponent( type, definition ) {

	if ( ComponentManager.components.type !== undefined ) return console.error( 'component ' + type + ' already exists' );

	// add config static variable if the definition doesn't have it
	if ( definition.config === undefined )
		definition.config = {};

	const schema = definition.config.schema;

	if ( schema !== undefined ) {

		for ( const name in schema ) {

			const prop = schema[ name ];

			if ( Array.isArray( prop ) ) {

				for ( let i = 0, len = prop.length; i < len; i ++ )
					ComponentManager.sanitizeSchema( prop[ i ] );

			} else {

				ComponentManager.sanitizeSchema( prop );

			}

		}

	}

	ComponentManager.properties.componentType.value = type;
	Object.defineProperties( definition.prototype, ComponentManager.properties );
	Object.assign( definition.prototype, EventDispatcher.prototype );

	ComponentManager.components[ type ] = definition;

}

export const ComponentManager = {
	components: {},
	properties: {
		componentType: { value: null },
		_enabled: { value: true, writable: true },
		enabled: {
			get() {

				return this._enabled;

			},
			set( value ) {

				if ( value !== this._enabled ) {

					if ( value && ! this.entity._enabled )
						return console.warn( "Component: Can't enable if the entity is disabled" );

					this._enabled = value;

					const container = this.entity.scene.components[ this.componentType ];

					if ( value === true ) {

						container.push( this );
						this.dispatchEvent( { type: 'enable' } );

					} else {

						container.splice( container.indexOf( this ), 1 );
						this.dispatchEvent( { type: 'disable' } );

					}

				}

			},
		},
		scene: {
			get() {

				return this.entity.scene;

			}
		},
		app: {
			get() {

				return this.entity.scene.app;

			}
		}
	},
	registerComponent,
	sanitizeSchema: function ( prop ) {

		if ( prop.default === undefined && prop.type === undefined ) {

			return console.error( 'ComponentManager: schema property requires a type or default value' );

		} else if ( prop.default === undefined ) {

			switch ( prop.type ) {

				case 'string':
					prop.default = '';
					break;
				case 'asset':
					prop.default = '';
					break;
				case 'color':
					prop.default = '#ffffff';
					break;
				case 'vector2':
					prop.default = [ 0, 0 ];
					break;
				case 'vector3':
					prop.default = [ 0, 0, 0 ];
					break;
				case 'vector4':
					prop.default = [ 0, 0, 0, 0 ];
					break;
				case 'boolean':
					prop.default = false;
					break;
				case 'number':
				case 'int':
					prop.default = 0;
					break;
				case 'select':
					prop.default = null;
					break;
				case 'entity':
					prop.default = null;
					break;
				default:
					return console.error( 'ComponentManager: invalid schema property type ' + typeof prop.type );

			}

		} else if ( prop.type === undefined ) {

			switch ( typeof prop.default ) {

				case 'number':
					prop.type = 'number';
					break;
				case 'string':
					if ( prop.default.length < 10 && prop.default.length > 0 && prop.default[ 0 ] === '#' )
						prop.type = 'color';
					else
						prop.type = 'string';
					break;
				case 'boolean':
					prop.type = 'boolean';
					break;
				case 'object':
					if ( Array.isArray( prop.default ) )
						prop.type = 'select';
					else return console.error( 'ComponentManager: could not infer property type from default ' + prop.default );
					break;
				default:
					return console.error( 'ComponentManager: could not infer property type from default ' + prop.default );

			}

		}

	},
	sanitizeData: function ( data, schema ) {

		const array = Object.keys( schema );
		// sorting array to place non-if attributes last
		array.sort( ( a, b ) => {

			if ( a.if === undefined )
				return - 1;
			else if ( b.if === undefined )
				return 1;
			return 0;

		} );

		while ( array.length > 0 ) {

			let i = array.length;

			while ( i -- ) {

				const name = array[ i ];
				let object = schema[ name ];

				if ( data[ name ] === undefined ) {

					if ( Array.isArray( object ) ) {

						let index = - 1;
						for ( let j = 0, len = object.length; j < len; j ++ ) {

							if ( ! this.loopDependency( array, data, object[ j ].if, i ) ) index = j;

						}

						if ( index > - 1 ) object = object[ index ];
						else continue;

					} else if ( this.loopDependency( array, data, object.if, i ) ) continue;


					data[ name ] = this.addDefault( object.type, object.default );

				}

				array.splice( i, 1 );

			}

		}

	},
	loopDependency: function ( array, data, dependencies, i ) {

		let exit = false;
		if ( dependencies !== undefined ) {

			for ( const d in dependencies ) {

				if ( array.includes( d ) ) {

					exit = true;
					break;

				} else if ( ! dependencies[ d ].includes( data[ d ] ) ) {

					array.splice( i, 1 );
					exit = true;
					break;

				}

			}

		}

		return exit;

	},
	addDefault: function ( type, _default ) {

		switch ( type ) {

			case 'vector2':
				return new Vector2( ..._default );
			case 'vector3':
				return new Vector3( ..._default );
			case 'vector4':
				return new Vector4( ..._default );
			case 'color':
				return new Color( _default );
			default:
				return _default;

		}

	}
};

// config: multiple, dependencies, schema
// schema is an object of objects
// ex: schema: {{type: "number", default: 1}}
