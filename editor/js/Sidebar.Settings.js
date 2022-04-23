import { UICheckbox, UIInput, UIPanel, UIRow, UISelect, UISpan, UIText } from './libs/ui.js';

import { SidebarSettingsVideo } from './Sidebar.Settings.Video.js';
import { SidebarSettingsRenderer } from './Sidebar.Settings.Renderer.js';
import { SidebarSettingsViewport } from './Sidebar.Settings.Viewport.js';
import { SidebarSettingsShortcuts } from './Sidebar.Settings.Shortcuts.js';
import { SidebarSettingsHistory } from './Sidebar.Settings.History.js';

function SidebarSettings( editor ) {

	const signals = editor.signals;
	const config = editor.config;
	const strings = editor.strings;

	const container = new UISpan();

	const settings = new UIPanel();
	settings.setBorderTop( '0' );
	settings.setPaddingTop( '20px' );
	container.add( settings );

	// Title

	const titleRow = new UIRow();
	const title = new UIInput( config.getKey( 'setting/title' ) ).setLeft( '100px' ).setWidth( '150px' ).onChange( function () {

		config.setKey( 'setting/title', this.getValue() );

	} );

	titleRow.add( new UIText( strings.getKey( 'sidebar/setting/title' ) ).setWidth( '90px' ) );
	titleRow.add( title );

	settings.add( titleRow );

	// Editable

	const editableRow = new UIRow();
	const editable = new UICheckbox( config.getKey( 'setting/editable' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'setting/editable', this.getValue() );

	} );

	editableRow.add( new UIText( strings.getKey( 'sidebar/setting/editable' ) ).setWidth( '90px' ) );
	editableRow.add( editable );

	settings.add( editableRow );

	// WebVR

	const vrRow = new UIRow();
	const vr = new UICheckbox( config.getKey( 'setting/vr' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'setting/vr', this.getValue() );

	} );

	vrRow.add( new UIText( strings.getKey( 'sidebar/setting/vr' ) ).setWidth( '90px' ) );
	vrRow.add( vr );

	settings.add( vrRow );

	//

	container.add( new SidebarSettingsRenderer( editor ) );

	if ( 'SharedArrayBuffer' in window ) {

		container.add( new SidebarSettingsVideo( editor ) );

	}

	// Signals

	signals.editorCleared.add( function () {

		title.setValue( '' );
		config.setKey( 'setting/title', '' );

	} );

	// language

	const options = {
		en: 'English',
		fr: 'Français',
		zh: '中文'
	};

	const languageRow = new UIRow();
	const language = new UISelect().setWidth( '150px' );
	language.setOptions( options );

	if ( config.getKey( 'language' ) !== undefined ) {

		language.setValue( config.getKey( 'language' ) );

	}

	language.onChange( function () {

		const value = this.getValue();

		editor.config.setKey( 'language', value );

	} );

	languageRow.add( new UIText( strings.getKey( 'sidebar/settings/language' ) ).setWidth( '90px' ) );
	languageRow.add( language );

	settings.add( languageRow );

	//

	container.add( new SidebarSettingsViewport( editor ) );
	container.add( new SidebarSettingsShortcuts( editor ) );
	container.add( new SidebarSettingsHistory( editor ) );

	return container;

}

export { SidebarSettings };
