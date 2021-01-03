import { Resizer } from './Resizer.js';
import { Toolbar } from './Toolbar.js';
import { Sidebar } from './Sidebar.js';
import { SidebarScene } from './Sidebar.Scene.js';
import * as TARO from '../../build/taro.js';

const app = new TARO.Application( {
	canvas: 'canvas'
} );

app.update();

const resizer = new Resizer();
const toolbar = new Toolbar();
const sidebar = new Sidebar();
const sidebarScene = new SidebarScene();
