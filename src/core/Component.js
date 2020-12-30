import { Renderable } from "../components/rendering/Renderable.js";
import { OrthographicCamera } from "../components/cameras/OrthographicCamera.js";
import { PerspectiveCamera } from "../components/cameras/PerspectiveCamera.js";
import { AmbientLight } from "../components/light/AmbientLight.js";
import { DirectionalLight } from "../components/light/DirectionalLight.js";
import { HemisphereLight } from "../components/light/HemisphereLight.js";
import { PointLight } from "../components/light/PointLight.js";
import { SpotLight } from "../components/light/SpotLight.js";
import { Rigidbody } from "../components/physics/Rigidbody.js";

import { BoxCollider } from "../components/physics/BoxCollider.js";
import { CapsuleCollider } from "../components/physics/CapsuleCollider.js";
import { ConeCollider } from "../components/physics/ConeCollider.js";
import { CylinderCollider } from "../components/physics/CylinderCollider.js";
import { MeshCollider } from "../components/physics/MeshCollider.js";
import { SphereCollider } from "../components/physics/SphereCollider.js";

import { BallJoint } from "../components/physics/BallJoint.js";
import { CylindricalJoint } from "../components/physics/CylindricalJoint.js";
import { PrismaticJoint } from "../components/physics/PrismaticJoint.js";
import { RagdollJoint } from "../components/physics/RagdollJoint.js";
import { HingeJoint } from "../components/physics/HingeJoint.js";
import { UniversalJoint } from "../components/physics/UniversalJoint.js";

import { EventDispatcher } from "../lib/three.js";

const prototype = {
	destroy: {
		value: function () {

			if ( this.enabled ) {

				const type = this.componentType;
				const container = this.entity.scene._containers[ type ];
				container.splice( container.indexOf( this ), 1 );

			} else {

				this.dispatchEvent( { type: "disable" } );

			}

			const components = this.entity._components;
			components.splice( components.indexOf( this ), 1 );

			this.dispatchEvent( { type: "destroy" } );

		},
	},
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
					this.dispatchEvent( { type: "enable" } );

				} else {

					container.splice( container.indexOf( this ), 1 );
					this.dispatchEvent( { type: "disable" } );

				}

			}

		},
	},
};

const _components = {};

function createComponent( type, obj, options = {} ) {

	if ( type in _components ) throw "Component type already exists";

	prototype.componentType.value = type;
	Object.defineProperties( obj.prototype, prototype );
	Object.assign( obj.prototype, EventDispatcher.prototype );

	_components[ type ] = [ obj, options ];
	return obj;

}

createComponent( "Renderable", Renderable );
createComponent( "OrthographicCamera", OrthographicCamera );
createComponent( "PerspectiveCamera", PerspectiveCamera );
createComponent( "AmbientLight", AmbientLight );
createComponent( "DirectionalLight", DirectionalLight );
createComponent( "HemisphereLight", HemisphereLight );
createComponent( "PointLight", PointLight );
createComponent( "SpotLight", SpotLight );
createComponent( "Rigidbody", Rigidbody );

createComponent( "BoxCollider", BoxCollider );
createComponent( "CapsuleCollider", CapsuleCollider );
createComponent( "ConeCollider", ConeCollider );
createComponent( "CylinderCollider", CylinderCollider );
createComponent( "MeshCollider", MeshCollider );
createComponent( "SphereCollider", SphereCollider );

createComponent( "BallJoint", BallJoint, {
	requiredComponents: [ "Rigidbody" ]
} );
createComponent( "CylindricalJoint", CylindricalJoint, {
	requiredComponents: [ "Rigidbody" ],
} );
createComponent( "PrismaticJoint", PrismaticJoint, {
	requiredComponents: [ "Rigidbody" ],
} );
createComponent( "RagdollJoint", RagdollJoint, {
	requiredComponents: [ "Rigidbody" ],
} );
createComponent( "HingeJoint", HingeJoint, { requiredComponents: [ "Rigidbody" ] } );
createComponent( "UniversalJoint", UniversalJoint, {
	requiredComponents: [ "Rigidbody" ]
} );

// options: allowMultiple, requiredComponents,

export { _components, createComponent };
