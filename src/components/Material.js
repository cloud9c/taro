import { ComponentManager } from '../core/ComponentManager.js';
import * as THREE from '../lib/three.js';

class Material {

	init( data ) {

		const type = data.type;

		delete data.type;

		for ( const name in data ) {

			if ( schema[ name ].type === 'select' && data[ name ] !== null && data[ name ][ 0 ] === data[ name ][ 0 ].toUpperCase() )
				data[ name ] = THREE[ data[ name ] ];

		}

		switch ( type ) {

			case 'basic':
				this.ref = new THREE.MeshBasicMaterial( data );
				break;
			case 'depth':
				this.ref = new THREE.MeshDepthMaterial( data );
				break;
			case 'lambert':
				this.ref = new THREE.MeshLambertMaterial( data );
				break;
			case 'matcap':
				this.ref = new THREE.MeshMatcapMaterial( data );
				break;
			case 'normal':
				this.ref = new THREE.MeshNormalMaterial( data );
				break;
			case 'phong':
				this.ref = new THREE.MeshPhongMaterial( data );
				break;
			case 'physical':
				this.ref = new THREE.MeshPhysicalMaterial( data );
				break;
			case 'standard':
				this.ref = new THREE.MeshStandardMaterial( data );
				break;
			case 'toon':
				this.ref = new THREE.MeshToonMaterial( data );
				break;
			case 'asset':
				this.ref = MaterialLoader.load(data.asset);
			default:
				throw new Error( 'Geometry: invalid material type ' + type );

		}

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );
		this.addEventListener( 'remove', this.onRemove );

	}

	onEnable() {

		const geometry = this.entity.getComponent( 'geometry' );
		if ( geometry !== undefined && geometry.enabled ) {

			geometry.mesh = this.mesh = new THREE.Mesh( geometry.ref, this.ref );
			this.entity.add( this.mesh );

		}

	}

	onDisable() {

		const geometry = this.entity.getComponent( 'geometry' );
		if ( geometry !== undefined && geometry.enabled ) {

			this.entity.remove( this.mesh );
			delete this.mesh;
			delete geometry.mesh;

		}

	}

}

const blendingModes = [ 'NoBlending', 'NormalBlending', 'AdditiveBlending', 'SubstractiveBlending', 'MultiplyBlending', 'CustomBlending' ];
const depthModes = [ 'NeverDepth', 'AlwaysDepth', 'LessDepth', 'LessEqualDepth', 'GreaterEqualDepth', 'GreaterDepth', 'NotEqualDepth' ];
const stencilFunctions = [ 'NeverStencilFunc', 'LessStencilFunc', 'EqualStencilFunc', 'LessEqualStencilFunc', 'GreaterStencilFunc', 'NotEqualStencilFunc', 'GreaterEqualStencilFunc', 'AlwaysStencilFunc' ];
const stencilOps = [ 'ZeroStencilOp', 'KeepStencilOp', 'ReplaceStencilOp', 'IncrementStencilOp', 'DecrementStencilOp', 'IncrementWrapStencilOp', 'DecrementWrapStencilOp', 'InvertStencilOp' ];
const blendingEquations = [ 'AddEquation', 'SubtractEquation', 'ReverseSubtractEquation', 'MinEquation', 'MaxEquation' ];
const sourceFactors = [ 'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor' ];
const destinationFactors = [ 'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor' ];
const sides = [ 'FrontSide', 'BackSide', 'DoubleSide' ];
const schema = {
	type: { type: 'select', default: 'basic', select: [ 'basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon', 'asset' ] },

	color: { type: 'color', if: { type: [ 'basic', 'lambert', 'matcap', 'phong', 'standard', 'physical', 'toon' ] } },
	roughness: { default: 1.0, if: { type: [ 'standard', 'physical' ] } },
	metalness: { default: 0, if: { type: [ 'standard', 'physical' ] } },
	emissive: { type: 'color', default: '#000000', if: { type: [ 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	emissiveIntensity: { default: 1, if: { type: [ 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	clearcoat: { default: 0.0, if: { type: [ 'physical' ] } },
	clearcoatRoughness: { default: 0.0, if: { type: [ 'physical' ] } },
	specular: { type: 'color', default: '#111111', if: { type: [ 'phong' ] } },
	shininess: { default: 30, if: { type: [ 'phong' ] } },
	vertexColors: { default: false, if: { type: ['basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon'] } },
	vertexTangents: { default: false, if: { type: [ 'standard', 'physical' ] } },

	depthPacking: { type: 'select', default: 'BasicDepthPacking', select: [ 'BasicDepthPacking', 'RGBADepthPacking' ], if: { type: [ 'depth' ] } },
	skinning: { default: false, if: { type: [ 'basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },

	map: { type: 'asset', if: { type: [ 'basic', 'depth', 'lambert', 'matcap', 'phong', 'standard', 'physical', 'toon' ] } },
	matcap: { type: 'asset', if: { type: [ 'matcap' ] } },
	alphaMap: { type: 'asset', if: { type: [ 'basic', 'depth', 'lambert', 'matcap', 'phong', 'standard', 'physical', 'toon' ] } },
	bumpMap: { type: 'asset', if: { type: [ 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	bumpScale: { default: 1, if: { type: [ 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	normalMap: { type: 'asset', if: { type: [ 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	normalScale: { type: 'vector2', default: [ 1, 1 ], if: { type: [ 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	clearcoatNormalMap: { type: 'asset', if: { type: [ 'physical' ] } },
	clearcoatNormalScale: { type: 'vector2', default: [ 1, 1 ], if: { type: [ 'physical' ] } },

	displacementMap: { type: 'asset', if: { type: [ 'depth', 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	displacementScale: { default: 1, if: { type: [ 'depth', 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	roughnessMap: { type: 'asset', if: { type: [ 'standard', 'physical' ] } },
	metalnessMap: { type: 'asset', if: { type: [ 'standard', 'physical' ] } },

	specularMap: { type: 'asset', if: { type: [ 'basic', 'lambert', 'phong' ] } },

	envMap: { type: 'asset', if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical' ] } },
	envMapIntensity: { default: 1, if: { type: [ 'standard', 'physical' ] } },

	lightMap: { type: 'asset', if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	lightMapIntensity: { default: 1, if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },

	aoMap: { type: 'asset', if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	aoMapIntensity: { default: 1, if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },

	emissiveMap: { type: 'asset', if: { type: [ 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	gradientMap: { type: 'asset', if: { type: [ 'toon' ] } },

	side: { type: 'select', default: 'FrontSide', select: sides, if: { type: ['basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon'] }  },
	flatShading: { default: false, if: { type: ['basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon'] } },
	blending: { type: 'select', default: 'NormalBlending', select: blendingModes, if: { type: ['basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon'] } },
	opacity: { default: 1.0, min: 0.0, max: 1.0, if: { type: ['basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon'] } },
	transparent: { default: false, if: { type: ['basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon'] } },
	alphaTest: { default: 0, min: 0, max: 1, if: { type: ['basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon'] } },
	depthTest: { default: true, if: { type: ['basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon'] } },
	depthWrite: { default: true, if: { type: ['basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon'] } },
	wireframe: { default: false, if: { type: [ 'basic', 'depth', 'lambert', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
};

ComponentManager.register( 'material', Material, {
	schema
} );
