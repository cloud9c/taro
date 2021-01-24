import { Sidebar } from './Sidebar.js';
import { Application, ComponentManager } from '../../build/taro.js';
import { Viewport } from './Viewport.js';
import { Toolbar } from './Toolbar.js';
import { SidebarScene } from './Sidebar.Scene.js';
import { SidebarInspector } from './Sidebar.Inspector.js';
import { Navbar } from './Navbar.js';

function Editor() {

	const runners = [ 'camera', 'geometry', 'light', 'material', 'renderable' ];
	for ( let i = 0, len = runners.length; i < len; i ++ )
		ComponentManager.components[ runners[ i ] ].config.runInEditor = true;

	this.sidebar = new Sidebar();

	this.app = new Application( { canvas: document.getElementById( 'canvas' ), antialias: true } );
	this.sidebarInspector = new SidebarInspector( this );
	this.viewport = new Viewport( this ); // control, orbit, scene, render
	this.render = this.viewport.render;

	this.toolbar = new Toolbar( this );
	this.sidebarScene = new SidebarScene( this );

	this.navbar = new Navbar( this );

	console.log( this.app );

	this.render();

}

const editor = new Editor();
