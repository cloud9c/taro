import { ComponentManager } from '../../../build/taro.module.js';

export function applicationToJSON( app ) {

	const data = {
		scenes: [],
		currentScene: app.currentScene.uuid,
		parameters: app.parameters
	};

	delete app.parameters.canvas;

	for ( let i = 0, len = app.scenes.length; i < len; i ++ )
		data.scenes[ i ] = sceneToJSON( app.scenes[ i ] );

	return data;

}

function sceneToJSON( scene ) {

	const data = {};

	data.uuid = scene.uuid;
	if ( scene.background !== null ) data.background = scene.background.toJSON();
	if ( scene.environment !== null ) data.environment = scene.environment.toJSON();
	if ( scene.fog !== null ) data.fog = scene.fog.toJSON();

	const children = scene.getEntities();
	if ( children.length > 0 ) {

		data.children = [];
		for ( let i = 0, len = children.length; i < len; i ++ )
			data.children.push( entityToJSON( children[ i ] ) );

	}

	return data;

}

function entityToJSON( entity ) {

	const data = {};

	data.uuid = entity.uuid;
	data.matrix = entity.matrix.toArray();

	if ( entity.tags.length !== 0 ) data.tags = entity.tags;
	if ( entity.componentData !== undefined ) data.components = JSON.parse(JSON.stringify(entity.componentData));

	if ( entity.name !== '' ) data.name = entity.name;
	if ( entity.castShadow === true ) data.castShadow = true;
	if ( entity.receiveShadow === true ) data.receiveShadow = true;
	if ( entity.visible === false ) entity.visible = false;
	if ( entity._enabled === false ) data.enabled = false;

	const children = entity.getEntities();
	if ( children.length > 0 ) {

		data.children = [];
		for ( let i = 0, len = children.length; i < len; i ++ )
			data.children.push( entityToJSON( children[ i ] ) );

	}

	return data;

}
