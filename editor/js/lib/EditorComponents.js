import { ComponentManager } from '../../../build/taro.module.js';

const runInEditor = [ 'camera', 'geometry', 'light', 'material', 'renderable', 'model' ];
for ( let i = 0, len = runInEditor.length; i < len; i ++ )
	ComponentManager.components[ runInEditor[ i ] ].config.runInEditor = true;

