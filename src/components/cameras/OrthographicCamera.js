import { OrthographicCamera as OC, Vector4 } from "../../lib/three.js";

export class OrthographicCamera extends OC {

	start( data ) {

		this._region = new Vector4();

		if ( "left" in data ) this.left = data.left;
		if ( "right" in data ) this.right = data.right;
		if ( "top" in data ) this.top = data.top;
		if ( "bottom" in data ) this.bottom = data.bottom;
		if ( "near" in data ) this.near = data.near;
		if ( "far" in data ) this.far = data.far;
		this.viewport =
			"viewport" in data ? data.viewport : new Vector4( 0, 0, 1, 1 );

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
			this._updateRegion( this.app.render.domElement );

	}

	_updateRegion( canvas ) {

		const view = this.viewport;
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

		return data;

	}

}
