import { ComponentManager } from '../../../build/taro.js';

const runInEditor = [ 'camera', 'geometry', 'light', 'material', 'renderable' ];
for ( let i = 0, len = runInEditor.length; i < len; i ++ ) {

	ComponentManager.components[ runInEditor[ i ] ].config.runInEditor = true;

}
