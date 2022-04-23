import * as TARO from 'taro';

import { UIPanel, UIRow, UIText, UIInput, UIButton, UISpan } from './libs/ui.js';

import { SetGeometryValueCommand } from './commands/SetGeometryValueCommand.js';

import { VertexNormalsHelper } from '../../examples/jsm/helpers/VertexNormalsHelper.js';

function SidebarComponents( editor ) {

	const strings = editor.strings;

	const signals = editor.signals;

	const container = new UIPanel();
	container.setBorderTop( '0' );
	container.setDisplay( 'none' );
	container.setPaddingTop( '20px' );

	return container;

}

export { SidebarComponents };
