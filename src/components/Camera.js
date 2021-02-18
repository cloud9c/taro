import { ComponentManager } from '../core/ComponentManager.js';
import { OrthographicCamera, PerspectiveCamera, Vector4 } from '../lib/three.module.js';

class Camera {

	init( data ) {

		this.type = data.type;
		const near = data.near;
		const far = data.far;

		this.viewport = data.viewport;
		this._region = new Vector4();

		switch ( this.type ) {

			case 'perspective':
				this.autoAspect = data.autoAspect;
				this.ref = new PerspectiveCamera( data.fov, data.aspect, data.near, data.far );
				break;
			case 'orthographic':
				this.ref = new OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );
				break;
			default:
				console.error( 'Camera: invalid camera type ' + this.type );

		}

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.entity.add( this.ref );

	}

	onDisable() {

		this.entity.remove( this.ref );

	}

	_updateRegion( canvas ) {

		const view = this.viewport;

		if ( this.type === 'perspective' && this.autoAspect === true ) {

			this.ref.aspect = ( canvas.width * view.z ) / ( canvas.height * view.w );
			this.ref.updateProjectionMatrix();

		}

		this._region.set(
			canvas.width * view.x,
			canvas.height * view.y,
			canvas.width * view.z,
			canvas.height * view.w
		);

	}

	updateProjectionMatrix() {

		this.ref.updateProjectionMatrix();

		if ( this.app !== undefined ) this._updateRegion( this.app.domElement );

	}

	static config = {
		schema: {
			type: { type: 'select', default: 'perspective', select: [ 'perspective', 'orthographic' ] },
			near: { default: 0.1 },
			far: { default: 2000 },

			autoAspect: { default: true, if: { type: [ 'perspective' ] } },
			aspect: { default: 1, if: { type: [ 'perspective' ], autoAspect: [ false ] } },
			fov: { default: 50, if: { type: [ 'perspective' ] } },

			left: { default: - 1, if: { type: [ 'orthographic' ] } },
			right: { default: 1, if: { type: [ 'orthographic' ] } },
			top: { default: 1, if: { type: [ 'orthographic' ] } },
			bottom: { default: - 1, if: { type: [ 'orthographic' ] } },

			viewport: { type: 'vector4', default: [ 0, 0, 1, 1 ] },
		}
	};

}

ComponentManager.registerComponent( 'camera', Camera );
