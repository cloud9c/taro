import { ComponentManager } from '../core/ComponentManager.js';
import { PerspectiveCamera, Vector4 } from '../lib/three.js';

export class Camera extends PerspectiveCamera {

	init( data ) {

		this.autoAspect = data.autoAspect;
		this.fov = data.fov;
		this.near = data.near;
		this.far = data.far;
		this.aspect = data.aspect;
		this.viewport = data.viewport;

		this._region = new Vector4();

		this.updateProjectionMatrix();

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		this.scene._cameras.push( this );
		this.entity.add( this );

	}

	onDisable() {

		this.scene._cameras.splice(
			this.scene._cameras.indexOf( this ),
			1
		);
		this.entity.remove( this );

	}

	updateProjectionMatrix() {

		if ( this.entity !== undefined )
			this._updateRegion( this.app.renderer.domElement );

		return super.updateProjectionMatrix();

	}

	_updateRegion( canvas ) {

		const view = this.viewport;
		if ( this.autoAspect === true ) {

			this.aspect = ( canvas.width * view.z ) / ( canvas.height * view.w );
			super.updateProjectionMatrix();

		}

		this._region.set(
			canvas.width * view.x,
			canvas.height * view.y,
			canvas.width * view.z,
			canvas.height * view.w
		);

	}

	toJSON( meta ) {

		const data = super.toJSON( meta );
		data.object.viewport = this.viewport.toArray();
		if ( this.entity !== undefined && this.autoAspect === true ) {

			delete data.object.aspect;

		}

		return data;

	}

}

ComponentManager.register( 'camera', Camera, {
	schema: {
		autoAspect: { default: true },
		fov: { default: 50 },
		near: { default: 0.1 },
		far: { default: 2000 },
		aspect: { default: 1 },
		viewport: { type: 'vector4', default: [ 0, 0, 1, 1 ] }
	},
	allowMultiple: false
} );
