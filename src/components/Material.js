import { ComponentManager } from '../core/ComponentManager.js';
import { Mesh, MaterialLoader, MeshBasicMaterial, MeshDepthMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial } from '../lib/three.js';

const materialLoader = new MaterialLoader();

class Material {

	init( data ) {

		const type = data.type;

		// temporary changes to data
		delete data.type;

		if ( data.blending !== undefined )
			data.blending = blendingModes.indexOf( data.blending );

		if ( data.side !== undefined )
			data.side = sides.indexOf( data.side );
		
		// asset property that needs to be deleted when re-inited
		delete this.promise;
		
		switch ( type ) {

			case 'basic':
				this.ref = new MeshBasicMaterial( data );
				break;
			case 'depth':
				this.ref = new MeshDepthMaterial( data );
				break;
			case 'lambert':
				this.ref = new MeshLambertMaterial( data );
				break;
			case 'matcap':
				this.ref = new MeshMatcapMaterial( data );
				break;
			case 'normal':
				this.ref = new MeshNormalMaterial( data );
				break;
			case 'phong':
				this.ref = new MeshPhongMaterial( data );
				break;
			case 'physical':
				this.ref = new MeshPhysicalMaterial( data );
				break;
			case 'standard':
				this.ref = new MeshStandardMaterial( data );
				break;
			case 'toon':
				this.ref = new MeshToonMaterial( data );
				break;
			case 'asset':
				this.ref = undefined;
				this.promise = materialLoader.load( data.asset, ( m ) => onLoad( m ), undefined, () => this.onError() );
				break;
			default:
				throw new Error( 'Material: invalid material type ' + type );

		}

		// fixes to temp changes
		data.type = type;

		if ( data.blending !== undefined )
			data.blending = blendingModes[ data.blending ];

		if ( data.side !== undefined )
			data.side = sides[ data.side ];

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );
		this.addEventListener( 'remove', this.onRemove );

	}

	onEnable() {

		const geometry = this.entity.getComponent( 'geometry' );
		if ( geometry !== undefined && geometry._enabled ) {

			const m = this.ref !== undefined ? this.ref : this.MissingMaterial;
			const g = geometry.ref !== undefined ? geometry.ref : geometry.MissingGeometry;

			geometry.mesh = this.mesh = new Mesh( g, m );

			if ( this.ref === undefined || geometry.ref === undefined )
				this.mesh.visible = false;

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

	onLoad( material ) {

		this.mesh.material = this.ref = material;
		if ( this._enabled ) this.mesh.visible = true;

		this.dispatchEvent( { type: 'load' } );

	}

	onError() {

		console.error( 'Material: missing material asset' );
		if ( this._enabled === true ) this.mesh.visible = true;

		this.dispatchEvent( { type: 'error' } );

	}

}

Material.prototype.MissingMaterial = new MeshBasicMaterial( { color: 0xff00ff } );

const notAsset = [ 'basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon' ];
const blendingModes = [ 'NoBlending', 'NormalBlending', 'AdditiveBlending', 'SubstractiveBlending', 'MultiplyBlending', 'CustomBlending' ];
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
	vertexColors: { default: false, if: { type: notAsset } },
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

	side: { type: 'select', default: 'FrontSide', select: sides, if: { type: notAsset } },
	flatShading: { default: false, if: { type: notAsset } },
	blending: { type: 'select', default: 'NormalBlending', select: blendingModes, if: { type: notAsset } },
	opacity: { default: 1.0, min: 0.0, max: 1.0, if: { type: notAsset } },
	transparent: { default: false, if: { type: notAsset } },
	alphaTest: { default: 0, min: 0, max: 1, if: { type: notAsset } },
	depthTest: { default: true, if: { type: notAsset } },
	depthWrite: { default: true, if: { type: notAsset } },
	wireframe: { default: false, if: { type: [ 'basic', 'depth', 'lambert', 'normal', 'phong', 'standard', 'physical', 'toon' ] } },
};

ComponentManager.register( 'material', Material, {
	schema
} );
