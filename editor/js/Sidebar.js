import { UITabbedPanel, UISpan } from './libs/ui.js';

import { SidebarScene } from './Sidebar.Scene.js';
import { SidebarProperties } from './Sidebar.Properties.js';
import { SidebarAnimation } from './Sidebar.Animation.js';
import { SidebarAssets } from './Sidebar.Assets.js';
import { SidebarSettings } from './Sidebar.Settings.js';

function Sidebar( editor ) {

	const strings = editor.strings;

	const container = new UITabbedPanel();
	container.setId( 'sidebar' );

	const scene = new UISpan().add(
		new SidebarScene( editor ),
		new SidebarProperties( editor ),
		new SidebarAnimation( editor ),
	);
	const assets = new SidebarAssets( editor );
	const settings = new SidebarSettings( editor );

	container.addTab( 'scene', strings.getKey( 'sidebar/scene' ), scene );
	container.addTab( 'assets', strings.getKey( 'sidebar/assets' ), assets );
	container.addTab( 'settings', strings.getKey( 'sidebar/settings' ), settings );
	container.select( 'scene' );

	return container;

}

export { Sidebar };
