import { Application, ComponentManager, Entity, Group } from '../../../build/taro.js';

Application.prototype.toJSON = function () {

	const data = {
		metadata: {
			type: 'App',
			generator: 'Application.toJSON'
		},
		scenes: [],
		currentScene: this.currentScene.uuid,
		parameters: Object.assign( {}, this.parameters ),
	};

	for ( let i = 0, len = this.scenes.length; i < len; i ++ )
		data.scenes[ i ] = this.scenes[ i ].toJSON();

	if ( data.parameters.canvas.id !== undefined )
		data.parameters.canvas = data.parameters.canvas.id;

	return data;

};

Entity.prototype.toJSON = function ( meta ) {

	const data = Group.prototype.toJSON.call( this, meta );
	const object = data.object;

	const children = object.children;

	for ( let i = 0, len = children.length; i < len; i ++ ) {

		if ( children[ i ].isEntity === undefined ) {

			children[ i ].component = true;

		}

	}

	object.isEntity = true;
	if ( this.tags.length !== 0 ) object.tags = this.tags;
	// componentData is modified by the editor
	// format: [{type: x, data: y}]
	if ( this.componentData !== undefined ) object.components = this.componentData;
	object.enabled = this._enabled;

	return data;

};
