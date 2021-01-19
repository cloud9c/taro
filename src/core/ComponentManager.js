import { EventDispatcher, Vector4, Vector3, Vector2 } from '../lib/three.js';

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

				if ( value != this._enabled ) {

					if ( value && ! this.entity._enabled )
						return console.warn(
							"Component: Can't enable if the entity is disabled"
						);
					this._enabled = value;

					const container = this.entity.scene._containers[
						this.componentType
					];
					if ( value ) {

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
	register: function ( type, constructor, config = {} ) {

		if ( this.components.type !== undefined ) throw 'component ' + type + ' already exists';

		if ( config.schema !== undefined ) {

			for ( const name in config.schema ) {

				const prop = config.schema[ name ];

				if ( prop.default === undefined && prop.type === undefined ) {

					throw Error( 'ComponentManager: schema property requires a type or default value' );

				} else if ( prop.default === undefined ) {

					switch ( prop.type ) {

						case 'string':
							prop.default = '';
							break;
						case 'asset':
							prop.default = null;
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
						case 'slider':
						case 'number':
						case 'int':
							prop.default = 0;
							break;
						case 'select':
							prop.default = prop.select[ 0 ];
							break;
						case 'entity':
							prop.default = null; // uuid of entity
							break;
						case 'class':
							prop.default = {};
						default:
							throw Error( 'ComponentManager: invalid schema property type ' + typeof prop.type );

					}

				} else if ( prop.type === undefined ) {

					switch ( typeof prop.default ) {

						case 'number':
							prop.type = 'number';
							break;
						case 'string':
							if ( prop.default.length < 10 && prop.default.length > 0 && prop.default[ 0 ] === '#' )
								prop.type = 'string';
							break;
						case 'boolean':
							prop.type = 'boolean';
							break;
						case 'object':
							if ( Array.isArray( prop.default ) )
								prop.type = 'select';
							else throw Error( 'ComponentManager: could not infer property type from default ' + prop.default );
							break;
						case 'function':
							prop.type = 'class';
							break;
						default:
							throw Error( 'ComponentManager: could not infer property type from default ' + prop.default );

					}

				}

				if ( prop.type === 'vector4' )
					prop.default = new Vector4().fromArray( prop.default );
				else if ( prop.type === 'vector3' )
					prop.default = new Vector3().fromArray( prop.default );
				else if ( prop.type === 'vector2' )
					prop.default = new Vector2().fromArray( prop.default );

			}

		}

		this.properties.componentType.value = type;
		Object.defineProperties( constructor.prototype, this.properties );
		Object.assign( constructor.prototype, EventDispatcher.prototype );

		this.components[ type ] = { constructor, config };

	}
};

// config: allowMultiple, dependencies, schema
// schema is an object of objects
// ex: schema: {{type: "number", default: 1}}
