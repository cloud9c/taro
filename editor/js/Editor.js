import { Sidebar } from './Sidebar.js';
import { Application } from '../../build/taro.js';
import { Viewport } from './Viewport.js';
import { Toolbar } from './Toolbar.js';
import { SidebarScene } from './Sidebar.Scene.js';
import { SidebarInspector } from './Sidebar.Inspector.js';

import './lib/TaroModded.js';
import { Player } from './lib/Player.js';

function Editor() {

	this.sidebar = new Sidebar();

	this.app = new Application( { canvas: document.getElementById( 'canvas' ), antialias: true } );
	this.sidebarInspector = new SidebarInspector( this );
	this.viewport = new Viewport( this ); // control, orbit, scene, render
	this.render = this.viewport.render;

	this.toolbar = new Toolbar( this );
	this.sidebarScene = new SidebarScene( this );

	this.render();

}

const editor = new Editor();
