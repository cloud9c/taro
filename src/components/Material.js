import { ComponentManager } from '../core/ComponentManager.js';
import * as THREE from '../lib/three.js';

export class Material {

	init( data ) {

		const type = data.type;

		for ( const name in data )
			if ( schema[ name ].type === 'select' && data[ name ] !== null )
				data[ name ] = THREE[ data[ name ] ];

		switch ( type ) {

			case 'basic':
				this.ref = new THREE.MeshBasicMaterial( data );
				break;
			default:
				throw new Error( 'Geometry: invalid material type ' + type );

		}

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		// this.entity.add( this.ref );

	}

	onDisable() {

		// this.entity.remove( this.ref );

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
	fog: { default: true },
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
	visible: { default: true }

	// basic material

};

ComponentManager.register( 'material', Material, {
	schema,
	allowMultiple: false
} );
