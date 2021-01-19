import { ComponentManager } from '../core/ComponentManager.js';
import * as THREE from '../lib/three.js';

export class Material {

	init( data ) {

		const type = data.type;
		console.log( data );
		delete data.type;

		for ( const name in data ) {

			console.log( name, schema );
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
			case 'distance':
				this.ref = new THREE.MeshDistanceMaterial( data );
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
			default:
				throw new Error( 'Geometry: invalid material type ' + type );

		}

		console.log( this.ref );

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );
		this.addEventListener( 'remove', this.onRemove );

	}

	onEnable() {

		const geometry = this.entity.getComponent( 'geometry' );
		if ( this.mesh === undefined && geometry !== undefined && geometry._enabled ) {

			geometry.mesh = this.mesh = new THREE.Mesh( geometry.ref, this.ref );
			this.entity.add( this.mesh );

		}

	}

	onDisable() {

		const geometry = this.entity.getComponent( 'geometry' );
		if ( geometry !== undefined && geometry._enabled ) {

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
	type: { default: 'basic' },
	// material
	alphaTest: { default: 0 },
	blending: { type: 'select', default: 'NormalBlending', select: blendingModes },
	// material - custom blending
	blendDst: { type: 'select', default: 'OneMinusSrcAlphaFactor', select: destinationFactors, if: { blending: [ 'CustomBlending' ] } },
	blendDstAlpha: { type: 'select', default: null, select: destinationFactors, if: { blending: [ 'CustomBlending' ] } },
	blendEquation: { type: 'select', default: 'AddEquation', select: blendingEquations, if: { blending: [ 'CustomBlending' ] } },
	blendEquationAlpha: { type: 'select', default: null, select: blendingEquations, if: { blending: [ 'CustomBlending' ] } },
	blendSrc: { type: 'select', default: 'SrcAlphaFactor', select: sourceFactors, if: { blending: [ 'CustomBlending' ] } },
	blendSrcAlpha: { type: 'select', default: null, select: sourceFactors, if: { blending: [ 'CustomBlending' ] } },

	colorWrite: { default: true },
	depthFunc: { type: 'select', default: 'LessEqualDepth', select: depthModes },
	depthWrite: { default: true },
	stencilWrite: { default: false },
	stencilWriteMask: { default: 0xFF },
	stencilFunc: { type: 'select', default: 'AlwaysStencilFunc', select: stencilFunctions },
	stencilRef: { type: 'int', default: 0 },
	stencilFuncMask: { default: 0xFF },
	stencilFail: { type: 'select', default: 'KeepStencilOp', select: stencilOps },
	stencilZFail: { type: 'select', default: 'KeepStencilOp', select: stencilOps },
	stencilZPass: { type: 'select', default: 'KeepStencilOp', select: stencilOps },
	flatShading: { default: false },
	fog: { default: true, if: { type: [ 'basic', 'lambert', 'matcap', 'phong', 'physical', 'standard', 'toon' ] } },
	fog: { default: false, if: { type: [ 'normal', 'distance', 'depth' ] } },
	opacity: { default: 1.0, min: 0.0, max: 1.0 },
	polygonOffset: { default: false },
	polygonOffsetFactor: { default: 0 },
	polygonOffsetUnits: { default: 0 },
	precision: { type: 'select', default: null, select: [ 'highp', 'mediump', 'lowp' ] },
	premultipliedAlpha: { default: false },
	dithering: { default: false },
	shadowSide: { type: 'select', default: null, select: sides },
	side: { type: 'select', default: 'FrontSide', select: sides },
	toneMapped: { default: true },
	transparent: { default: false },
	vertexColors: { default: false },
	visible: { default: true },

	// // basic material
	alphaMap: { type: 'asset', if: { type: [ 'basic', 'depth', 'distance', 'lambert', 'matcap', 'phong', 'standard', 'physical', 'toon' ] } },
	aoMap: { type: 'asset', if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	aoMapIntensity: { default: 1, if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	color: { type: 'color', if: { type: [ 'basic', 'lambert', 'matcap', 'phong', 'standard', 'physical', 'toon' ] } },
	combine: { type: 'select', select: [ 'MultiplyOperation', 'MixOperation', 'AddOperation' ], if: { type: [ 'basic', 'lambert', 'phong' ] } },
	envMap: { type: 'asset', if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical' ] } },
	lightMap: { type: 'asset', if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	lightMapIntensity: { default: 1, if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	map: { type: 'asset', if: { type: [ 'basic', 'depth', 'distance', 'lambert', 'matcap', 'phong', 'standard', 'physical', 'toon' ] } },
	morphTargets: { default: false, if: { type: [ 'basic', 'depth', 'distance', 'lambert', 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	reflectivity: { default: 1, min: 0, max: 1, if: { type: [ 'basic', 'lambert', 'phong', 'physical' ] } },
	refractionRatio: { default: 0.98, max: 1, if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical' ] } },
	skinning: { default: false, if: { type: [ 'basic', 'depth', 'distance', 'lambert', 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	specularMap: { type: 'asset', if: { type: [ 'basic', 'lambert', 'phong' ] } },
	wireframe: { default: false, if: { type: [ 'basic', 'depth', 'lambert', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	wireframeLinecap: { type: 'select', default: 'round', select: [ 'butt', 'round', 'square' ], if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	wireframeLinejoin: { type: 'select', default: 'round', select: [ 'round', 'bevel', 'miter' ], if: { type: [ 'basic', 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	wireframeLinewidth: { default: 1, if: { type: [ 'basic', 'depth', 'lambert', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },

	// // depth material - fog false
	displacementMap: { type: 'asset', if: { type: [ 'depth', 'distance', 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	displacementScale: { default: 1, if: { type: [ 'depth', 'distance', 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	displacementBias: { default: 0, if: { type: [ 'depth', 'distance', 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },

	// distance material - fog false
	farDistance: { default: 1000, if: { type: [ 'distance' ] } },
	nearDistance: { default: 1, if: { type: [ 'distance' ] } },
	referencePosition: { type: 'vector3', if: { type: [ 'distance' ] } },

	// lambert material
	emissive: { type: 'color', default: '#000000', if: { type: [ 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	emissiveMap: { type: 'asset', if: { type: [ 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	emissiveIntensity: { default: 1, if: { type: [ 'lambert', 'phong', 'standard', 'physical', 'toon' ] } },
	morphNormals: { default: false, if: { type: [ 'lambert', 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },

	// matcap material
	bumpMap: { type: 'asset', if: { type: [ 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	bumpScale: { default: 1, if: { type: [ 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	matcap: { type: 'asset', if: { type: [ 'matcap' ] } },
	normalMap: { type: 'asset', if: { type: [ 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	normalMapType: { type: 'select', default: 'TangentSpaceNormalMap', select: [ 'TangentSpaceNormalMap', 'ObjectSpaceNormalMap' ], if: { type: [ 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
	normalScale: { type: 'vector2', default: [ 1, 1 ], if: { type: [ 'matcap', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },

	// normal material - fog false

	// phong material
	shininess: { default: 30, if: { type: [ 'phong' ] } },
	specular: { type: 'color', default: '#111111', if: { type: [ 'phong' ] } },

	// standard material ( also physical because its a child of standard)
	envMapIntensity: { default: 1, if: { type: [ 'standard', 'physical' ] } },
	metalness: { default: 0, if: { type: [ 'standard', 'physical' ] } },
	metalnessMap: { type: 'asset', if: { type: [ 'standard', 'physical' ] } },
	roughness: { default: 1.0, if: { type: [ 'standard', 'physical' ] } },
	roughnessMap: { type: 'asset', if: { type: [ 'standard', 'physical' ] } },
	vertexTangents: { default: false, if: { type: [ 'standard', 'physical' ] } },

	// physical material
	clearcoat: { default: 0.0, if: { type: [ 'physical' ] } },
	clearcoatMap: { type: 'asset', if: { type: [ 'physical' ] } },
	clearcoatNormalMap: { type: 'asset', if: { type: [ 'physical' ] } },
	clearcoatNormalScale: { type: 'vector2', default: [ 1, 1 ], if: { type: [ 'physical' ] } },
	clearcoatRoughness: { default: 0.0, if: { type: [ 'physical' ] } },
	clearcoatRoughnessMap: { type: 'asset', if: { type: [ 'physical' ] } },
	ior: { default: 1.5, min: 1.0, max: 2.333, if: { type: [ 'physical' ] } },
	sheen: { type: 'color', default: null, if: { type: [ 'physical' ] } },
	transmission: { default: 0.0, min: 0.0, max: 1.0, if: { type: [ 'physical' ] } },
	transmissionMap: { type: 'asset', if: { type: [ 'physical' ] } },

	// toon material
	gradientMap: { type: 'asset', if: { type: [ 'toon' ] } },
};

ComponentManager.register( 'material', Material, {
	schema,
	allowMultiple: false
} );
