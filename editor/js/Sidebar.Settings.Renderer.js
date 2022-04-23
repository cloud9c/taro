import * as TARO from 'taro';

import { UINumber, UIPanel, UIRow, UISelect, UIText } from './libs/ui.js';
import { UIBoolean } from './libs/ui.taro.js';

function SidebarSettingsRenderer( editor ) {

	const config = editor.config;
	const signals = editor.signals;
	const strings = editor.strings;

	let currentRenderer = null;

	const container = new UIPanel();

	const headerRow = new UIRow();
	headerRow.add( new UIText( strings.getKey( 'sidebar/setting/renderer' ).toUpperCase() ) );
	container.add( headerRow );

	// Antialias

	const antialiasRow = new UIRow();
	container.add( antialiasRow );

	antialiasRow.add( new UIText( strings.getKey( 'sidebar/setting/antialias' ) ).setWidth( '90px' ) );

	const antialiasBoolean = new UIBoolean( config.getKey( 'setting/renderer/antialias' ) ).onChange( createRenderer );
	antialiasRow.add( antialiasBoolean );

	// Physically Correct lights

	const physicallyCorrectLightsRow = new UIRow();
	container.add( physicallyCorrectLightsRow );

	physicallyCorrectLightsRow.add( new UIText( strings.getKey( 'sidebar/setting/physicallyCorrectLights' ) ).setWidth( '90px' ) );

	const physicallyCorrectLightsBoolean = new UIBoolean( config.getKey( 'setting/renderer/physicallyCorrectLights' ) ).onChange( function () {

		currentRenderer.physicallyCorrectLights = this.getValue();
		signals.rendererUpdated.dispatch();

	} );
	physicallyCorrectLightsRow.add( physicallyCorrectLightsBoolean );

	// Shadows

	const shadowsRow = new UIRow();
	container.add( shadowsRow );

	shadowsRow.add( new UIText( strings.getKey( 'sidebar/setting/shadows' ) ).setWidth( '90px' ) );

	const shadowsBoolean = new UIBoolean( config.getKey( 'setting/renderer/shadows' ) ).onChange( updateShadows );
	shadowsRow.add( shadowsBoolean );

	const shadowTypeSelect = new UISelect().setOptions( {
		0: 'Basic',
		1: 'PCF',
		2: 'PCF Soft',
		//	3: 'VSM'
	} ).setWidth( '125px' ).onChange( updateShadows );
	shadowTypeSelect.setValue( config.getKey( 'setting/renderer/shadowType' ) );
	shadowsRow.add( shadowTypeSelect );

	function updateShadows() {

		currentRenderer.shadowMap.enabled = shadowsBoolean.getValue();
		currentRenderer.shadowMap.type = parseFloat( shadowTypeSelect.getValue() );

		signals.rendererUpdated.dispatch();

	}

	// Tonemapping

	const toneMappingRow = new UIRow();
	container.add( toneMappingRow );

	toneMappingRow.add( new UIText( strings.getKey( 'sidebar/setting/toneMapping' ) ).setWidth( '90px' ) );

	const toneMappingSelect = new UISelect().setOptions( {
		0: 'No',
		1: 'Linear',
		2: 'Reinhard',
		3: 'Cineon',
		4: 'ACESFilmic'
	} ).setWidth( '120px' ).onChange( updateToneMapping );
	toneMappingSelect.setValue( config.getKey( 'setting/renderer/toneMapping' ) );
	toneMappingRow.add( toneMappingSelect );

	const toneMappingExposure = new UINumber( config.getKey( 'setting/renderer/toneMappingExposure' ) );
	toneMappingExposure.setDisplay( toneMappingSelect.getValue() === '0' ? 'none' : '' );
	toneMappingExposure.setWidth( '30px' ).setMarginLeft( '10px' );
	toneMappingExposure.setRange( 0, 10 );
	toneMappingExposure.onChange( updateToneMapping );
	toneMappingRow.add( toneMappingExposure );

	function updateToneMapping() {

		toneMappingExposure.setDisplay( toneMappingSelect.getValue() === '0' ? 'none' : '' );

		currentRenderer.toneMapping = parseFloat( toneMappingSelect.getValue() );
		currentRenderer.toneMappingExposure = toneMappingExposure.getValue();
		signals.rendererUpdated.dispatch();

	}

	//

	function createRenderer() {

		currentRenderer = new TARO.WebGLRenderer( { antialias: antialiasBoolean.getValue() } );
		currentRenderer.outputEncoding = TARO.sRGBEncoding;
		currentRenderer.physicallyCorrectLights = physicallyCorrectLightsBoolean.getValue();
		currentRenderer.shadowMap.enabled = shadowsBoolean.getValue();
		currentRenderer.shadowMap.type = parseFloat( shadowTypeSelect.getValue() );
		currentRenderer.toneMapping = parseFloat( toneMappingSelect.getValue() );
		currentRenderer.toneMappingExposure = toneMappingExposure.getValue();

		signals.rendererCreated.dispatch( currentRenderer );
		signals.rendererUpdated.dispatch();

	}

	createRenderer();


	// Signals

	signals.editorCleared.add( function () {

		currentRenderer.physicallyCorrectLights = false;
		currentRenderer.shadowMap.enabled = true;
		currentRenderer.shadowMap.type = TARO.PCFShadowMap;
		currentRenderer.toneMapping = TARO.NoToneMapping;
		currentRenderer.toneMappingExposure = 1;

		physicallyCorrectLightsBoolean.setValue( currentRenderer.physicallyCorrectLights );
		shadowsBoolean.setValue( currentRenderer.shadowMap.enabled );
		shadowTypeSelect.setValue( currentRenderer.shadowMap.type );
		toneMappingSelect.setValue( currentRenderer.toneMapping );
		toneMappingExposure.setValue( currentRenderer.toneMappingExposure );
		toneMappingExposure.setDisplay( currentRenderer.toneMapping === 0 ? 'none' : '' );

		signals.rendererUpdated.dispatch();

	} );

	signals.rendererUpdated.add( function () {

		config.setKey(
			'setting/renderer/antialias', antialiasBoolean.getValue(),
			'setting/renderer/physicallyCorrectLights', physicallyCorrectLightsBoolean.getValue(),
			'setting/renderer/shadows', shadowsBoolean.getValue(),
			'setting/renderer/shadowType', parseFloat( shadowTypeSelect.getValue() ),
			'setting/renderer/toneMapping', parseFloat( toneMappingSelect.getValue() ),
			'setting/renderer/toneMappingExposure', toneMappingExposure.getValue()
		);

	} );

	return container;

}

export { SidebarSettingsRenderer };
