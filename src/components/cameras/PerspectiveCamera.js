import { PerspectiveCamera as PC, Vector4 } from "../../lib/three.js";

export class PerspectiveCamera extends PC {

	start( data ) {

		this._region = new Vector4();
		this.autoAspect = true;

		if ( data.fov !== undefined ) this.fov = data.fov;
		if ( data.near !== undefined ) this.near = data.near;
		if ( data.far !== undefined ) this.far = data.far;

		this.viewport = data.viewport !== undefined ? data.viewport : new Vector4( 0, 0, 1, 1 );

		if ( data.aspect !== undefined ) this.aspect = data.aspect;

		this.updateProjectionMatrix();

		this.addEventListener( "enable", this.onEnable );
		this.addEventListener( "disable", this.onDisable );

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

		super.updateProjectionMatrix();
		if ( this.entity !== undefined )
			this._updateRegion( this.app.renderer.domElement );

	}

	_updateRegion( canvas ) {

		const view = this.viewport;
		if ( this.autoAspect ) {

			this._aspect = ( canvas.width * view.z ) / ( canvas.height * view.w );
			super.updateProjectionMatrix();

		}

		this._region.set(
			canvas.width * view.x,
			canvas.height * view.y,
			canvas.width * view.z,
			canvas.height * view.w
		);

	}

	get aspect() {

		return this._aspect;

	}

	set aspect( x ) {

		this.autoAspect = false;
		this._aspect = x;

	}

	toJSON( meta ) {

		const data = super.toJSON( meta );
		data.object.viewport = this.viewport.toArray();
		if ( data.object.autoAspect )
			data.object.autoAspect = true;

		return data;

	}

}
