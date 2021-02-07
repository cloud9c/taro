import { ComponentManager } from '../core/ComponentManager.js';
import { TextureLoader, Mesh, MaterialLoader, MeshBasicMaterial, MeshDepthMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial } from '../lib/three.module.js';

const materialLoader = new MaterialLoader();
const textureLoader = new TextureLoader();
const notAsset = [ 'basic', 'depth', 'lambert', 'matcap', 'normal', 'phong', 'physical', 'standard', 'toon' ];
const blendingModes = [ 'NoBlending', 'NormalBlending', 'AdditiveBlending', 'SubstractiveBlending', 'MultiplyBlending', 'CustomBlending' ];
const sides = [ 'FrontSide', 'BackSide', 'DoubleSide' ];
const depthPacking = [ 'BasicDepthPacking', 'RGBADepthPacking' ];

class Material {

	init( data ) {

		const type = data.type;
		const parameters = {};

		for ( const name in data ) {

			if ( Material.config.schema[ name ].type === 'asset' && data[ name ].length > 0 )
				parameters[ name ] = textureLoader.load( data[ name ] );
			else
				parameters[ name ] = data[ name ];

		}

		delete parameters.type;

		if ( parameters.blending !== undefined )
			parameters.blending = blendingModes.indexOf( parameters.blending );
		if ( parameters.side !== undefined )
			parameters.side = sides.indexOf( parameters.side );
		if ( parameters.depthPacking !== undefined )
			parameters.depthPacking = depthPacking.indexOf( parameters.depthPacking ) + 3200;

		switch ( type ) {

			case 'basic':
				this.ref = new MeshBasicMaterial( parameters );
				break;
			case 'depth':
				this.ref = new MeshDepthMaterial( parameters );
				break;
			case 'lambert':
				this.ref = new MeshLambertMaterial( parameters );
				break;
			case 'matcap':
				this.ref = new MeshMatcapMaterial( parameters );
				break;
			case 'normal':
				this.ref = new MeshNormalMaterial( parameters );
				break;
			case 'phong':
				this.ref = new MeshPhongMaterial( parameters );
				break;
			case 'physical':
				this.ref = new MeshPhysicalMaterial( parameters );
				break;
			case 'standard':
				this.ref = new MeshStandardMaterial( parameters );
				break;
			case 'toon':
				this.ref = new MeshToonMaterial( parameters );
				break;
			case 'asset':
				this.ref = undefined;
				materialLoader.load( parameters.asset, ( m ) => this.onLoad( m ), ( p ) => this.onProgress( p ), ( e ) => this.onError( e ) );
				break;
			default:
				console.error( 'Material: invalid material type ' + type );

		}

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		const geometry = this.entity.getComponent( 'geometry' );

		if ( geometry !== undefined && geometry._enabled ) {

			const g = geometry.ref !== undefined ? geometry.ref : geometry.DefaultGeometry;
			const m = this.ref !== undefined ? this.ref : this.DefaultMaterial;

			geometry.mesh = this.mesh = new Mesh( g, m );
			this.mesh.castShadow = true;
			this.mesh.receiveShadow = true;
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

		this.ref = material;
		if ( this.mesh !== undefined )
			this.mesh.material = material;

		this.dispatchEvent( { type: 'load' } );

	}

	onProgress( event ) {

		this.dispatchEvent( { type: 'progress', progressEvent: event } );

	}

	onError( error ) {

		console.error( 'Material: failed retrieving asset' );
		this.dispatchEvent( { type: 'error', error } );

	}

	static config = {
		schema: {
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

			depthPacking: { type: 'select', default: 'BasicDepthPacking', select: depthPacking, if: { type: [ 'depth' ] } },
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

			asset: { type: 'asset', if: { type: [ 'asset' ] } },
		}
	};

}

Material.prototype.DefaultMaterial = new MeshBasicMaterial();
Material.prototype.DefaultMaterial.transparent = true;
Material.prototype.DefaultMaterial.opacity = 0;

ComponentManager.register( 'material', Material );
