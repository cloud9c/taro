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

export const ComponentManager = {
	_components: {},
	add( type, constructor, options = {} ) {

		if ( type in this._components ) throw 'component ' + type + ' already exists';

		this.properties.componentType.value = type;
		Object.defineProperties( constructor.prototype, this.properties );
		Object.assign( constructor.prototype, EventDispatcher.prototype );

		this._components[ type ] = {
			constructor, options
		};

	},

	remove( type ) {

		if ( type in this._components )
			delete this._components[ type ];
		else
			console.warn( 'component ' + type + ' does not exists' );

	},

	get( type ) {

		return this._components[ type ];

	},

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
	}
};

ComponentManager.add( 'Renderable', Renderable );
ComponentManager.add( 'OrthographicCamera', OrthographicCamera );
ComponentManager.add( 'PerspectiveCamera', PerspectiveCamera );

ComponentManager.add( 'Rigidbody', Rigidbody );

ComponentManager.add( 'BoxCollider', BoxCollider );
ComponentManager.add( 'CapsuleCollider', CapsuleCollider );
ComponentManager.add( 'ConeCollider', ConeCollider );
ComponentManager.add( 'CylinderCollider', CylinderCollider );
ComponentManager.add( 'MeshCollider', MeshCollider );
ComponentManager.add( 'SphereCollider', SphereCollider );

ComponentManager.add( 'BallJoint', BallJoint, { requiredComponents: [ 'Rigidbody' ] } );
ComponentManager.add( 'CylindricalJoint', CylindricalJoint, { requiredComponents: [ 'Rigidbody' ] } );
ComponentManager.add( 'PrismaticJoint', PrismaticJoint, { requiredComponents: [ 'Rigidbody' ] } );
ComponentManager.add( 'RagdollJoint', RagdollJoint, { requiredComponents: [ 'Rigidbody' ] } );
ComponentManager.add( 'HingeJoint', HingeJoint, { requiredComponents: [ 'Rigidbody' ] } );
ComponentManager.add( 'UniversalJoint', UniversalJoint, { requiredComponents: [ 'Rigidbody' ] } );

// options: allowMultiple, requiredComponents, schema

// schema can be an array of strings or an array of objects (containing value, type, etc)
// ex: schema: ["velocity"]
// ex: schema: [{name: "velocity", accessor: "_velocity"}]
