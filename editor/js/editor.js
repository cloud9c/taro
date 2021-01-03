import { Resizer } from './Resizer.js';
import { Toolbar } from './Toolbar.js';
import { Sidebar } from './Sidebar.js';
import { SidebarScene } from './Sidebar.Scene.js';
import * as TARO from '../../build/taro.js';

const app = new TARO.Application( {
	canvas: 'canvas'
} );

const scene = new TARO.Scene();
app.setScene( scene );

const camera = new TARO.Entity();
camera.addComponent( 'PerspectiveCamera' );
camera.position.z = 5;

const box = new TARO.Entity();
box.addComponent( 'Renderable', new TARO.Mesh( new TARO.BoxGeometry(), new TARO.MeshBasicMaterial( { color: 0x00ff00 } ) ) );

app.renderer.setClearColor( 0xaaaaaa );

app.update();

const resizer = new Resizer();
const toolbar = new Toolbar();
const sidebar = new Sidebar();
const sidebarScene = new SidebarScene();
