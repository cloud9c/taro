import { Resizer } from './Resizer.js';
import { Toolbar } from './Toolbar.js';
import { Sidebar } from './Sidebar.js';
import { SidebarScene } from './Sidebar.Scene.js';
import { Viewport } from './Viewport.js';
import { Application } from '../../build/taro.js';

const resizer = new Resizer();
const sidebar = new Sidebar();

const app = new Application( { canvas: 'canvas' } );
const viewport = new Viewport( app );

const toolbar = new Toolbar( viewport.control );
const sidebarScene = new SidebarScene( viewport.scene, app.renderer, viewport.render );
