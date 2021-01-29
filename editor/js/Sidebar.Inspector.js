import { MathUtils, ComponentManager, Vector4, Vector3, Vector2, Color, TextureLoader, Fog, FogExp2, WebGLCubeRenderTarget } from '../../build/taro.js';

export function SidebarInspector( editor ) {

	const inspector = document.getElementById( 'inspector' );
	const scene = editor.viewport.scene;
	let currentEntity = null;

	this.attach = function ( entity ) {

		if ( currentEntity !== null ) this.detach();
		currentEntity = entity;

		// display: none for the scene inspector
		document.getElementById( 'scene-default' ).style.display = 'none';

		this.addEntitySection( entity );

		const components = entity.componentData;

		if ( components !== undefined ) {

			for ( let i = 0, len = components.length; i < len; i ++ ) {

				const config = ComponentManager.components[ components[ i ].type ].config;
				inspector.appendChild( this.addSection( components[ i ], config ) );

			}

		}

	};

	this.detach = function () {

		currentEntity = null;
		document.getElementById( 'scene-default' ).style.display = '';

		while ( inspector.children.length > 1 ) inspector.removeChild( inspector.lastChild );

	};

	this.onInspectorChange = function ( fieldset, type, data, oldValue, config ) {

		const schema = config.schema;
		const section = fieldset.parentElement;

		for ( const name in schema ) {

			let attribute = schema[ name ];
			if ( Array.isArray( attribute ) ) {

				let currentAttribute;
				let matchFound = false;

				for ( let i = 0, len = attribute.length; i < len; i ++ ) {

					if ( attribute[ i ].if !== undefined && attribute[ i ].if[ type ] !== undefined ) {

						const dependencies = attribute[ i ].if;

						let oldExit = false;
						let newExit = false;

						for ( const d in dependencies ) {

							if ( ! dependencies[ d ].includes( oldValue ) ) oldExit = true;
							if ( ! dependencies[ d ].includes( data[ type ] ) ) newExit = true;

							if ( oldExit && newExit ) break;

						}

						if ( oldExit && ! newExit ) {

							if ( data[ name ] !== undefined ) {

								section.querySelector( 'fieldset[data-type="' + name + '"]' ).remove();

							}

							data[ name ] = ComponentManager.addDefault( attribute[ i ].type, attribute[ i ].default );
							section.appendChild( this.addFieldset( name, data, config ) );

							// add
							matchFound = true;
							break;

						} else if ( ! oldExit && ! newExit ) {

							matchFound = true;
							break;

						}

					} else {

						matchFound = true;
						break;

					}

				}

				const fieldset = section.querySelector( 'fieldset[data-type="' + name + '"]' );

				if ( ! matchFound && fieldset !== null ) {

					// remove
					delete data[ name ];
					fieldset.remove();

				}

			} else {

				if ( attribute.if !== undefined && attribute.if[ type ] !== undefined ) {

					if ( attribute.if[ type ].includes( data[ type ] ) ) {

						if ( data[ name ] === undefined ) {

							// add attribute to data
							data[ name ] = ComponentManager.addDefault( attribute.type, attribute.default );
							section.appendChild( this.addFieldset( name, data, config ) );

						}

					} else {

						const fieldset = section.querySelector( 'fieldset[data-type="' + name + '"]' );

						if ( data[ name ] !== undefined ) {

							// remove attribute from data
							delete data[ name ];
							fieldset.remove();

						}

					}

				}

			}

		}

		if ( config.runInEditor === true ) {

			const components = currentEntity.components;
			let component;
			for ( let i = 0, len = components.length; i < len; i ++ ) {

				if ( components[ i ].uuid === section.dataset.uuid ) {

					component = components[ i ];
					break;

				}

			}

			if ( config.onValueChanged !== undefined ) {

				config.onValueChanged.call( component, type, data );

			} else {

				component.enabled = false;
				component.init( data );
				component.enabled = true;

			}

			editor.render();

		}

	};

	this.addFieldset = function ( type, data, config ) {

		const schema = config.schema;
		let attribute = schema[ type ];

		if ( Array.isArray( attribute ) ) {

			for ( let i = 0, len = attribute.length; i < len; i ++ ) {

				const dependencies = attribute.if;
				if ( dependencies !== undefined ) {

					let exit = false;
					for ( d in dependencies ) {

						if ( ! dependencies[ d ].includes( data[ d ] ) ) {

							exit = true;
							break;

						}

					}

					if ( exit ) continue;

				}

				attribute = schema[ type ][ i ];
				break;

			}

		}

		const value = data[ type ];
		const currentType = type;
		const fieldset = document.createElement( 'FIELDSET' );
		fieldset.dataset.type = type;
		const legend = document.createElement( 'LEGEND' );
		legend.textContent = attribute.label !== undefined ? attribute.label : type;
		fieldset.appendChild( legend );

		let input, div, vector;

		switch ( attribute.type ) {

			case 'string':
				input = document.createElement( 'INPUT' );
				input.type = 'text';
				input.value = value;
				input.addEventListener( 'change', () => {

					const oldValue = data[ currentType ];
					data[ currentType ] = input.value;
					this.onInspectorChange( fieldset, type, data, oldValue, config );

				} );
				fieldset.appendChild( input );
				break;
			case 'color':
				input = document.createElement( 'INPUT' );
				input.type = 'color';
				input.value = '#' + value.getHexString();
				input.addEventListener( 'input', () => {

					const oldValue = data[ currentType ];
					data[ currentType ].set( input.value );
					this.onInspectorChange( fieldset, type, data, oldValue, config );

				} );
				fieldset.appendChild( input );
				break;
			case 'vector2':
				for ( let i = 0; i < 2; i ++ ) {

					const input = document.createElement( 'INPUT' );
					input.style.width = '78px';
					input.type = 'number';

					if ( i == 1 ) input.style.marginLeft = '6px';

					input.value = value.getComponent( i );
					const index = i;
					input.addEventListener( 'change', () => {

						const oldValue = data[ currentType ];
						let value = parseFloat( input.value );

						if ( attribute.min !== undefined ) value = Math.max( attribute.min, value );
						if ( attribute.max !== undefined ) value = Math.min( attribute.max, value );
						if ( attribute.type === 'int' ) value = Math.round( value );
						input.value = value;

						data[ currentType ].setComponent( index, value );
						this.onInspectorChange( fieldset, type, data, oldValue, config );

					} );

					fieldset.appendChild( input );

				}

				break;
			case 'vector3':
				for ( let i = 0; i < 3; i ++ ) {

					const input = document.createElement( 'INPUT' );
					input.type = 'number';

					if ( i == 1 )
						input.style.margin = '0px 6px';

					input.value = value.getComponent( i );
					const index = i;
					input.addEventListener( 'change', () => {

						const oldValue = data[ currentType ];
						let value = parseFloat( input.value );

						if ( attribute.min !== undefined ) value = Math.max( attribute.min, value );
						if ( attribute.max !== undefined ) value = Math.min( attribute.max, value );
						if ( attribute.type === 'int' ) value = Math.round( value );
						input.value = value;

						data[ currentType ].setComponent( index, value );
						this.onInspectorChange( fieldset, type, data, oldValue, config );

					} );

					fieldset.appendChild( input );

				}

				break;
			case 'vector4':
				div = document.createElement( 'DIV' );
				div.style = 'display: flex;flex-wrap: wrap;width:162px';
				for ( let i = 0; i < 4; i ++ ) {

					const input = document.createElement( 'INPUT' );
					input.type = 'number';

					if ( i == 0 || i == 1 )
						input.style.marginBottom = '4px';

					if ( i == 1 || i == 3 ) {

						input.style.marginLeft = '4px';
						input.style.width = 'calc(50% - 4px)';

					} else {

						input.style.width = '50%';

					}

					input.value = value.getComponent( i );
					const index = i;
					input.addEventListener( 'change', () => {

						const oldValue = data[ currentType ];
						let value = parseFloat( input.value );

						if ( attribute.min !== undefined ) value = Math.max( attribute.min, value );
						if ( attribute.max !== undefined ) value = Math.min( attribute.max, value );
						if ( attribute.type === 'int' ) value = Math.round( value );
						input.value = value;

						data[ currentType ].setComponent( index, value );
						this.onInspectorChange( fieldset, type, data, oldValue, config );

					} );

					div.appendChild( input );

				}

				fieldset.appendChild( div );

				break;
			case 'boolean':
				input = document.createElement( 'INPUT' );
				input.type = 'checkbox';
				if ( value ) input.checked = true;
				input.addEventListener( 'change', () => {

					const oldValue = data[ currentType ];
					data[ currentType ] = input.checked;
					this.onInspectorChange( fieldset, type, data, oldValue, config );

				} );
				fieldset.appendChild( input );
				break;
			case 'number':
			case 'int':
				input = document.createElement( 'INPUT' );
				input.type = 'number';
				input.style.width = '114px';
				input.value = value;
				input.addEventListener( 'change', () => {

					const oldValue = data[ currentType ];
					let value = parseFloat( input.value );

					if ( attribute.min !== undefined ) value = Math.max( attribute.min, value );
					if ( attribute.max !== undefined ) value = Math.min( attribute.max, value );
					if ( attribute.type === 'int' ) value = Math.round( value );
					input.value = value;

					data[ currentType ] = value;
					this.onInspectorChange( fieldset, type, data, oldValue, config );

				} );
				fieldset.appendChild( input );
				break;
			case 'select':
				input = document.createElement( 'SELECT' );
				const options = attribute.select;

				for ( let i = 0, len = options.length; i < len; i ++ ) {

					const option = document.createElement( 'OPTION' );
					option.value = options[ i ];
					option.textContent = options[ i ];

					if ( options[ i ] === value )
						option.selected = true;


					input.appendChild( option );

				}

				input.addEventListener( 'change', () => {

					const oldValue = data[ currentType ];
					data[ currentType ] = input.value;
					this.onInspectorChange( fieldset, type, data, oldValue, config );

				} );

				fieldset.appendChild( input );
				break;
			case 'asset': // TODO
				input = document.createElement( 'INPUT' );
				input.type = 'file';
				fieldset.appendChild( input );
				break;
			case 'class': // REWORK
				break;
			case 'entity': // TODO
				break;
			default:
				return console.warn( 'SidebarInspector: Invalid schema type: ' + attribute.type );

		}

		return fieldset;

	};

	this.addSection = function ( component, config ) {

		const data = component.data;

		const section = document.createElement( 'SECTION' );
		section.dataset.uuid = component.uuid;
		section.classList.add( 'component' );

		const title = document.createElement( 'H1' );
		title.textContent = component.type;
		title.dataset.opened = '';
		title.addEventListener( 'pointerdown', () => {

			if ( title.dataset.opened !== undefined ) {

				// close

				const fieldsets = section.querySelectorAll( 'fieldset' );

				for ( let i = 0, len = fieldsets.length; i < len; i ++ ) {

					fieldsets[ i ].style.display = 'none';

				}

				delete title.dataset.opened;

			} else {

				// open up

				const fieldsets = section.querySelectorAll( 'fieldset' );
				for ( let i = 0, len = fieldsets.length; i < len; i ++ ) {

					fieldsets[ i ].style.display = '';

				}

				title.dataset.opened = '';

			}

		} );
		section.appendChild( title );

		const schema = config.schema;

		if ( schema !== undefined ) {

			for ( const type in data ) {

				section.appendChild( this.addFieldset( type, data, config ) );

			}

		}

		return section;

	};

	this.addSceneSection = function () {

		const textureLoader = new TextureLoader();

		let colorBackground = new Color();
		let textureBackground, textureEquirect, environmentTexture;
		const fog = new Fog();
		const fogExp2 = new FogExp2();

		function processFile( files, target ) {

			if ( files.length === 0 ) return;

			const canvas = target.getElementsByClassName( 'file-display' )[ 0 ];
			const context = canvas.getContext( '2d' );
			const reader = new FileReader();

			reader.onload = () => {

				textureLoader.load( reader.result, function ( texture ) {

					const image = texture.image;
					const scale = canvas.width / image.width;

					context.fillStyle = '#fff';
					context.fillRect( 0, 0, canvas.width, canvas.height );
					context.drawImage( image, canvas.width / 2 - image.width * scale / 2,
						canvas.height / 2 - image.height * scale / 2, image.width * scale, image.height * scale );

					switch ( target.id ) {

						case 'background-texture':
							textureBackground = texture;
							onTextureOption();
							break;
						case 'background-equirect':
							textureEquirect = new WebGLCubeRenderTarget( image.height );
							textureEquirect.fromEquirectangularTexture( renderer, texture );
							onEquirectOption();
							break;
						case 'environment-texture':
							environmentTexture = texture;
							onEnvironmentOption();

					}

				} );

			};

			reader.readAsDataURL( files[ 0 ] );

		}

		function onChange() {

			processFile( this.files, this.parentElement );

		}

		function onFileDown( event ) {

			if ( event.isPrimary === false ) return;

			event.target.querySelector( 'input' ).click();

		}

		function onDragEnter( event ) {

			event.stopPropagation();
			event.preventDefault();

		}

		function onDrop( event ) {

			event.stopPropagation();
			event.preventDefault();

			processFile( event.dataTransfer.files, event.target );

		}

		const dropboxes = document.querySelectorAll( '#scene .file-wrapper' );
		const hiddenInputs = document.querySelectorAll( '#scene .hidden-input' );

		for ( let i = 0, len = dropboxes.length; i < len; i ++ ) {

			hiddenInputs[ i ].addEventListener( 'change', onChange, false );
			dropboxes[ i ].addEventListener( 'pointerdown', onFileDown, false );
			dropboxes[ i ].addEventListener( 'dragenter', onDragEnter, false );
			dropboxes[ i ].addEventListener( 'dragover', onDragEnter, false );
			dropboxes[ i ].addEventListener( 'drop', onDrop, false );

		}

		function resetBackgroundInput() {

			document.getElementById( 'background-color' ).style.removeProperty( 'display' );
			document.getElementById( 'background-texture' ).style.removeProperty( 'display' );
			document.getElementById( 'background-equirect' ).style.removeProperty( 'display' );

		}

		function onColorOption() {

			colorBackground.set( document.getElementById( 'background-color' ).value );
			scene.background = colorBackground;
			editor.render();

		}

		function onTextureOption() {

			if ( textureBackground !== undefined ) {

				scene.background = textureBackground;
				editor.render();

			}

		}

		function onEquirectOption() {

			if ( textureEquirect !== undefined ) {

				scene.background = textureEquirect;
				editor.render();

			}

		}

		document.getElementById( 'background-color' ).addEventListener( 'input', onColorOption );

		document.getElementById( 'background' ).addEventListener( 'change', function ( event ) {

			resetBackgroundInput();

			switch ( event.target.value ) {

				case 'none':
					scene.background = null;
					this.style.removeProperty( 'min-width' );
					editor.render();
					break;
				case 'color':
					document.getElementById( 'background-color' ).style.setProperty( 'display', 'inherit' );
					onColorOption( event.target );
					this.style.setProperty( 'min-width', '90px' );
					break;
				case 'texture':
					document.getElementById( 'background-texture' ).style.setProperty( 'display', 'inherit' );
					onTextureOption();
					this.style.setProperty( 'min-width', '90px' );
					break;
				case 'equirect':
					document.getElementById( 'background-equirect' ).style.setProperty( 'display', 'inherit' );
					onEquirectOption();
					this.style.setProperty( 'min-width', '90px' );

			}

		} );

		function onEnvironmentOption() {

			if ( environmentTexture !== undefined ) {

				scene.environment = environmentTexture;
				editor.render();

			}

		}

		document.getElementById( 'environment' ).addEventListener( 'change', function ( event ) {

			switch ( event.target.value ) {

				case 'none':
					document.getElementById( 'environment-texture' ).style.removeProperty( 'display' );
					scene.environment = null;
					editor.render();
					this.style.removeProperty( 'min-width' );
					break;
				case 'texture':
					document.getElementById( 'environment-texture' ).style.setProperty( 'display', 'inherit' );
					onEnvironmentOption();
					this.style.setProperty( 'min-width', '90px' );
					break;

			}

		} );

		const fogOptions = document.querySelectorAll( '#fog-options input' );
		const linearFog = document.getElementById( 'linear-fog' ).children;
		const expFog = document.getElementById( 'exponential-fog' ).children;
		const linearColor = document.getElementById( 'color-linear-fog' );
		const expColor = document.getElementById( 'color-exp-fog' );

		function resetFogInput() {

			document.getElementById( 'linear-fog' ).style.removeProperty( 'display' );
			linearColor.style.removeProperty( 'display' );
			document.getElementById( 'exponential-fog' ).style.removeProperty( 'display' );
			expColor.style.removeProperty( 'display' );

		}

		document.getElementById( 'fog' ).addEventListener( 'change', function ( event ) {

			resetFogInput();

			switch ( event.target.value ) {

				case 'none':
					scene.fog = null;
					this.style.removeProperty( 'min-width' );
					editor.render();
					break;
				case 'linear':
					document.getElementById( 'linear-fog' ).style.setProperty( 'display', 'flex' );
					this.style.setProperty( 'min-width', '90px' );
					linearColor.style.setProperty( 'display', 'inherit' );
					setFog();
					break;
				case 'exponential':
					document.getElementById( 'exponential-fog' ).style.setProperty( 'display', 'flex' );
					this.style.setProperty( 'min-width', '90px' );
					expColor.style.setProperty( 'display', 'inherit' );
					setExpFog();
					break;

			}

		} );

		function setFog() {

			console.log( 'here' );
			fog.color.set( linearColor.value );
			fog.near = parseFloat( linearFog[ 0 ].value );
			fog.far = parseFloat( linearFog[ 1 ].value );

			scene.fog = fog;
			editor.render();

		}

		function setExpFog() {

			fogExp2.color.set( expColor.value );
			fogExp2.density = parseFloat( expFog[ 0 ].value );

			scene.fog = fogExp2;
			editor.render();

		}

		linearColor.addEventListener( 'input', setFog );
		expColor.addEventListener( 'input', setExpFog );
		linearFog[ 0 ].addEventListener( 'input', setFog );
		linearFog[ 1 ].addEventListener( 'input', setFog );
		expFog[ 0 ].addEventListener( 'input', setExpFog );

	};

	this.addEntitySection = function ( entity ) {

		let section = document.createElement( 'SECTION' );
		section.id = 'entity-section';
		let fieldset, legend, x, y, z, input, enabled, label;

		fieldset = document.createElement( 'FIELDSET' );

		enabled = document.createElement( 'INPUT' );
		enabled.type = 'checkbox';
		if ( entity.enabled )
			enabled.checked = true;
		enabled.addEventListener( 'change', function () {

			entity.enabled = this.checked;
			editor.render();

		} );
		fieldset.appendChild( enabled );

		const type = document.createElement( 'INPUT' );
		type.type = 'text';
		type.value = entity.name;
		type.style = 'margin-left: 8px;width: 100%;';
		type.addEventListener( 'change', function () {

			entity.name = this.value;
			document.querySelector( '#scene-tree div[data-id="' + entity.id + '"' ).textContent = this.value;
			editor.render();

		} );
		fieldset.appendChild( type );
		section.appendChild( fieldset );
		const xyz = [ 'x', 'y', 'z' ];
		const translation = [ 'position', 'rotation', 'scale' ];

		for ( let i = 0; i < 3; i ++ ) {

			fieldset = document.createElement( 'FIELDSET' );

			legend = document.createElement( 'LEGEND' );
			legend.textContent = translation[ i ].charAt( 0 ).toUpperCase() + translation[ i ].slice( 1 );
			fieldset.appendChild( legend );

			for ( let j = 0; j < 3; j ++ ) {

				input = document.createElement( 'INPUT' );
				input.type = 'number';
				input.dataset.translation = translation[ i ];
				input.dataset.xyz = xyz[ j ];
				if ( xyz[ j ] === 'y' ) input.style.margin = '0 6px';

				if ( translation[ i ] === 'rotation' ) {

					input.addEventListener( 'change', function () {

						entity[ translation[ i ] ][ xyz[ j ] ] = MathUtils.degToRad( parseFloat( this.value ) );
						editor.render();

					} );

				} else {

					input.addEventListener( 'change', function () {

						entity[ translation[ i ] ][ xyz[ j ] ] = parseFloat( this.value );
						editor.render();

					} );

				}

				fieldset.appendChild( input );

			}

			section.appendChild( fieldset );

		}

		fieldset = document.createElement( 'FIELDSET' );

		legend = document.createElement( 'LEGEND' );
		legend.textContent = 'Shadow';
		fieldset.appendChild( legend );

		const div = document.createElement( 'DIV' );
		div.style = 'display:flex;align-items:center;width:162px';

		enabled = document.createElement( 'INPUT' );
		enabled.type = 'checkbox';
		if ( entity.castShadow )
			enabled.checked = true;
		enabled.addEventListener( 'change', function () {

			entity.castShadow = this.checked;
			editor.render();

		} );
		div.appendChild( enabled );

		label = document.createElement( 'LABEL' );
		label.textContent = 'Cast';
		label.style.marginRight = '16px';
		div.appendChild( label );

		enabled = document.createElement( 'INPUT' );
		enabled.type = 'checkbox';
		if ( entity.receiveShadow )
			enabled.checked = true;
		enabled.addEventListener( 'change', function () {

			entity.receiveShadow = this.checked;
			editor.render();

		} );
		div.appendChild( enabled );

		label = document.createElement( 'LABEL' );
		label.textContent = 'Receive';
		div.appendChild( label );

		fieldset.appendChild( div );
		section.appendChild( fieldset );

		fieldset = document.createElement( 'FIELDSET' );
		legend = document.createElement( 'LEGEND' );

		legend.textContent = 'Visible';
		fieldset.appendChild( legend );

		enabled = document.createElement( 'INPUT' );
		enabled.type = 'checkbox';
		if ( entity.visible )
			enabled.checked = true;
		enabled.addEventListener( 'change', function () {

			entity.visible = this.checked;
			editor.render();

		} );
		fieldset.appendChild( enabled );
		section.appendChild( fieldset );

		inspector.appendChild( section );

		section = document.createElement( 'SECTION' );
		section.id = 'component-wrapper';

		const componentSelector = document.createElement( 'INPUT' );
		componentSelector.type = 'text';
		componentSelector.placeholder = 'Add Component...';
		componentSelector.id = 'component-selector';

		const componentList = document.createElement( 'DIV' );
		componentList.id = 'component-list';

		componentSelector.addEventListener( 'focus', () => {

			const components = Object.keys( ComponentManager.components ).sort();
			for ( let i = 0, len = components.length; i < len; i ++ ) {

				const type = components[ i ];

				const allowMultiple = ComponentManager.components[ type ].config.allowMultiple;
				const componentData = entity.componentData;
				if ( allowMultiple === false && componentData !== undefined ) {

					let disabled = false;
					for ( let i = 0, len = componentData.length; i < len; i ++ ) {

						if ( componentData[ i ].type === type ) {

							disabled = true;
							break;

						}

					}

					if ( disabled ) continue;

				}

				const component = document.createElement( 'DIV' );
				component.textContent = type;

				componentList.appendChild( component );

			}

			componentList.style.maxHeight = '400px';

		} );

		componentSelector.addEventListener( 'focusout', () => {

			componentList.style.maxHeight = 0;
			while ( componentList.firstChild !== null ) componentList.removeChild( componentList.lastChild );

		} );

		componentSelector.addEventListener( 'input', () => {

			const components = componentList.children;
			const text = componentSelector.value;

			for ( let i = 0, len = components.length; i < len; i ++ ) {

				if ( components[ i ].textContent.includes( text ) )
					components[ i ].style.display = '';
				else
					components[ i ].style.display = 'none';

			}

			componentSelector.value;

		} );

		componentList.addEventListener( 'pointerdown', ( event ) => {

			this.addComponent( currentEntity, event.target.textContent );

		} );

		section.appendChild( componentSelector );
		section.appendChild( componentList );

		inspector.appendChild( section );

	};

	this.addComponent = function ( entity, type, data = {} ) {

		if ( entity.componentData === undefined ) entity.componentData = [];

		const component = { type, data, uuid: MathUtils.generateUUID() };
		const config = ComponentManager.components[ type ].config;
		const schema = config.schema;
		const runInEditor = config.runInEditor === true;

		if ( schema !== undefined ) {

			ComponentManager.sanitizeData( component.data, schema );
			if ( entity === currentEntity ) inspector.appendChild( this.addSection( component, config ) );

		}

		if ( runInEditor ) {

			const _component = entity.addComponent( type, component.data );
			_component.uuid = component.uuid;

		}

		entity.componentData.push( component );
		editor.render();

	};

	this.addSceneSection();

}
