import { UITabbedPanel } from './libs/ui.js';

import { SidebarObject } from './Sidebar.Object.js';
import { SidebarComponents } from './Sidebar.Components.js';

function SidebarProperties( editor ) {

	const strings = editor.strings;

	const container = new UITabbedPanel();
	container.setId( 'properties' );

	container.addTab( 'object', strings.getKey( 'sidebar/properties/object' ), new SidebarObject( editor ) );
	container.addTab( 'components', strings.getKey( 'sidebar/properties/components' ), new SidebarComponents( editor ) );
	container.select( 'object' );

	return container;

}

export { SidebarProperties };
