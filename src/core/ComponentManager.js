import { Object3D } from '../components/Object3D.js';
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

		this.add( 'object3D', Object3D );
		this.add( 'camera', Camera );
		this.add( 'rigidbody', Rigidbody );
		this.add( 'collider', Collider );
		this.add( 'joint', Joint, { requiredComponents: [ 'rigidbody' ] } );

	}

	add( type, constructor, options = {} ) {

		if ( this.components.type !== undefined ) throw 'component ' + type + ' already exists';

		this.properties.componentType.value = type;
		Object.defineProperties( constructor.prototype, this.properties );
		Object.assign( constructor.prototype, EventDispatcher.prototype );

		this.components[ type ] = {
			constructor, options
		};

	}

	remove( type ) {

		if ( type in this.components )
			delete this.components[ type ];
		else
			console.warn( 'component ' + type + ' does not exists' );

	}

}

// options: allowMultiple, requiredComponents, schema

// schema is an array of objects
// ex: schema: [{name: "velocity", type: "number", default}]
// ex: schema: [{name: "velocity"}]
