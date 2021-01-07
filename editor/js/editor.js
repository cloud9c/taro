import { Resizer } from './Resizer.js';
import { Toolbar } from './Toolbar.js';
import { Sidebar } from './Sidebar.js';
import { SidebarScene } from './Sidebar.Scene.js';
import { Viewport } from './Viewport.js';
import { Application } from '../../build/taro.js';

function Editor() {

	this.resizer = new Resizer();
	this.sidebar = new Sidebar();

	this.app = new Application( { canvas: 'canvas', antialias: true } );
	this.viewport = new Viewport( this ); // control, orbit, scene, render
	this.render = this.viewport.render;

	this.toolbar = new Toolbar( this );
	this.sidebarScene = new SidebarScene( this );

	this.render();

}

const editor = new Editor();
