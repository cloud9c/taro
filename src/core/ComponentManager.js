import { Renderable } from '../components/Renderable.js';

import { OrthographicCamera } from '../components/cameras/OrthographicCamera.js';
import { PerspectiveCamera } from '../components/cameras/PerspectiveCamera.js';

import { Rigidbody } from '../components/physics/Rigidbody.js';

import { BoxCollider } from '../components/physics/colliders/BoxCollider.js';
import { CapsuleCollider } from '../components/physics/colliders/CapsuleCollider.js';
import { ConeCollider } from '../components/physics/colliders/ConeCollider.js';
import { CylinderCollider } from '../components/physics/colliders/CylinderCollider.js';
import { MeshCollider } from '../components/physics/colliders/MeshCollider.js';
import { SphereCollider } from '../components/physics/colliders/SphereCollider.js';

import { BallJoint } from '../components/physics/joints/BallJoint.js';
import { CylindricalJoint } from '../components/physics/joints/CylindricalJoint.js';
import { PrismaticJoint } from '../components/physics/joints/PrismaticJoint.js';
import { RagdollJoint } from '../components/physics/joints/RagdollJoint.js';
import { HingeJoint } from '../components/physics/joints/HingeJoint.js';
import { UniversalJoint } from '../components/physics/joints/UniversalJoint.js';

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

		this.add( 'Renderable', Renderable );
		this.add( 'OrthographicCamera', OrthographicCamera );
		this.add( 'PerspectiveCamera', PerspectiveCamera );

		this.add( 'Rigidbody', Rigidbody );

		this.add( 'BoxCollider', BoxCollider );
		this.add( 'CapsuleCollider', CapsuleCollider );
		this.add( 'ConeCollider', ConeCollider );
		this.add( 'CylinderCollider', CylinderCollider );
		this.add( 'MeshCollider', MeshCollider );
		this.add( 'SphereCollider', SphereCollider );

		this.add( 'BallJoint', BallJoint, { requiredComponents: [ 'Rigidbody' ] } );
		this.add( 'CylindricalJoint', CylindricalJoint, { requiredComponents: [ 'Rigidbody' ] } );
		this.add( 'PrismaticJoint', PrismaticJoint, { requiredComponents: [ 'Rigidbody' ] } );
		this.add( 'RagdollJoint', RagdollJoint, { requiredComponents: [ 'Rigidbody' ] } );
		this.add( 'HingeJoint', HingeJoint, { requiredComponents: [ 'Rigidbody' ] } );
		this.add( 'UniversalJoint', UniversalJoint, { requiredComponents: [ 'Rigidbody' ] } );

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
