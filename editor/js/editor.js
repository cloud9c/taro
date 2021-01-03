import { Resizer } from './Resizer.js';
import { Toolbar } from './Toolbar.js';
import { Sidebar } from './Sidebar.js';
import { SidebarScene } from './Sidebar.Scene.js';
import { Viewport } from './Viewport.js';
import { Application } from '../../build/taro.js';

// editor stuff
const resizer = new Resizer();
const toolbar = new Toolbar();
const sidebar = new Sidebar();
const sidebarScene = new SidebarScene();

const app = new Application( {canvas: 'canvas'} );

const viewport = new Viewport( app );