import { ComponentManager } from '../../../build/taro.js';

const runInEditor = [ 'camera', 'geometry', 'light', 'material', 'renderable' ];
for ( let i = 0, len = runInEditor.length; i < len; i ++ ) {
	ComponentManager.components[ runInEditor[ i ] ].config.runInEditor = true;
}

ComponentManager.components[ "geometry" ].config.onValueChanged = function(type, data) {
	this.enabled = false;
	this.init(data);
	this.enabled = true;
}

ComponentManager.components[ "light" ].config.onValueChanged = function(type, data) {
	this.enabled = false;
	this.init(data);
	this.enabled = true;
}

ComponentManager.components[ "material" ].config.onValueChanged = function(type, data) {
	this.enabled = false;
	this.init(data);
	this.enabled = true;
}

ComponentManager.components[ "renderable" ].config.onValueChanged = function(type, data) {
	this.enabled = false;
	this.init(data);
	this.enabled = true;
}