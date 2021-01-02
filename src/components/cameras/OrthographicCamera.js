import { OrthographicCamera as OC, Vector4 } from '../../lib/three.js';

export class OrthographicCamera extends OC {

	start( data ) {

		this._region = new Vector4();

		if ( data.left !== undefined ) this.left = data.left;
		if ( data.right !== undefined ) this.right = data.right;
		if ( data.top !== undefined ) this.top = data.top;
		if ( data.bottom !== undefined ) this.bottom = data.bottom;
		if ( data.near !== undefined ) this.near = data.near;
		if ( data.far !== undefined ) this.far = data.far;
		this.viewport =
			data.viewport !== undefined ? data.viewport : new Vector4( 0, 0, 1, 1 );

		this.updateProjectionMatrix();

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );
		this.addEventListener( 'sceneadd', this.onEnable );
		this.addEventListener( 'sceneremove', this.onDisable );

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

	fromJSON( object ) {

		object.viewport = new Vector4().fromArray( object.viewport );

		return object;

	}

}
