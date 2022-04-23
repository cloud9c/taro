import { UICheckbox, UIInput, UIPanel, UIRow, UISelect, UISpan, UIText } from './libs/ui.js';

function SidebarAssets( editor ) {

	const signals = editor.signals;
	const config = editor.config;
	const strings = editor.strings;

	const container = new UISpan();

	const assets = new UIPanel();
	assets.setBorderTop( '0' );
	assets.setPaddingTop( '20px' );
	container.add( assets );

	return container;

}

export { SidebarAssets };
