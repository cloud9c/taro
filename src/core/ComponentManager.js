import { Renderable } from '../components/Renderable.js';
import { Camera } from '../components/Camera.js';
import { Rigidbody } from '../components/physics/Rigidbody.js';
import { Collider } from '../components/physics/Collider.js';
import { Joint } from '../components/physics/Joint.js';
import { EventDispatcher } from '../lib/three.js';

export class ComponentManager {

	constructor() {

		this.components = {};
		this.properties = {
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
		};

		this.register( 'renderable', Renderable );
		this.register( 'camera', Camera );
		this.register( 'rigidbody', Rigidbody );
		this.register( 'collider', Collider );
		this.register( 'joint', Joint, { requiredComponents: [ 'rigidbody' ] } );

	}

	register( type, constructor, options = {} ) {

		if ( this.components.type !== undefined ) throw 'component ' + type + ' already exists';

		this.properties.componentType.value = type;
		Object.defineProperties( constructor.prototype, this.properties );
		Object.assign( constructor.prototype, EventDispatcher.prototype );

		this.components[ type ] = {
			constructor, options
		};

	}

}

// options: allowMultiple, requiredComponents, schema

// schema is an array of objects
// ex: schema: [{name: "velocity", type: "number", default}]
// ex: schema: [{name: "velocity"}]
