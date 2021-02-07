import {
	TextureLoader,
	CameraHelper,
	PointLightHelper,
	DirectionalLightHelper,
	SpotLightHelper,
	HemisphereLightHelper,
	SkeletonHelper,
	ComponentManager,
	WebGLCubeRenderTarget,
	Sprite,
	SpriteMaterial,
	Fog,
	FogExp2,
	Color,
	MathUtils,
	Box3
} from '../../build/taro.module.js';

export function SidebarInspector( editor ) {

	const inspector = document.getElementById( 'inspector' );
	const scene = editor.viewport.scene;
	const closedComponents = {};
	let currentEntity = undefined;
	const box = new Box3();
	const helpers = editor.viewport.helpers;
	const icons = editor.viewport.icons;
	const iconMaterials = {
		light: null,
		camera: null
	};
	let currentDrag = undefined;
	const textureLoader = new TextureLoader();

	function addHelpers( entity ) {

		const components = entity.components;
		for ( let i = 0, len = components.length; i < len; i ++ ) {

			const object = components[ i ];

			if ( closedComponents[ object.componentType ] === true || object.enabled === false ) continue;

			let helper;

			if ( object.componentType === 'camera' && object.ref !== undefined ) {

				helper = new CameraHelper( object.ref );

			} else if ( object.componentType === 'light' && object.ref !== undefined ) {

				const ref = object.ref;

				if ( ref.isPointLight ) {

					helper = new PointLightHelper( object.ref, 1 );

				} else if ( ref.isDirectionalLight ) {

					helper = new DirectionalLightHelper( object.ref, 1 );

				} else if ( ref.isSpotLight ) {

					helper = new SpotLightHelper( object.ref, 1 );

				} else if ( ref.isHemisphereLight ) {

					helper = new HemisphereLightHelper( object.ref, 1 );

				} else {

					continue;

				}

			} else if ( object.componentType === 'model' && object.ref !== undefined ) {

				// helper = new SkeletonHelper( object.ref.skeleton.bones[ 0 ] );
				continue;

			} else {

				// no helper for this object type
				continue;

			}

			helpers.push( helper );
			scene.add( helper );

		}

	}

	function removeHelpers() {

		for ( let i = 0, len = helpers.length; i < len; i ++ )
			scene.remove( helpers[ i ] );

		// empty array while maintaing reference in viewport
		helpers.length = 0;

	}

	this.attach = function ( entity ) {

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

		addHelpers( entity );

	};

	this.detach = function () {

		removeHelpers();

		currentEntity = undefined;
		document.getElementById( 'scene-default' ).style.display = '';

		while ( inspector.children.length > 1 ) inspector.removeChild( inspector.lastChild );

	};

	this.cloneData = function ( data ) {

		const clonedData = {};
		for ( const name in data ) {

			if ( typeof clonedData[ name ] === 'object' ) {

				clonedData[ name ] = cloneData[ name ].clone();

			} else {

				clonedData[ name ] = data[ name ];

			}

		}

		return clonedData;

	};

	this.onInspectorChange = function ( fieldset, type, data, oldValue, config ) {

		const schema = config.schema;
		const section = fieldset.parentElement;

		if ( schema !== undefined ) {

			let keepGoing = false;

			for ( const name in schema ) {

				const attribute = schema[ name ];

				if ( Array.isArray( attribute ) ) {

					for ( let i = 0, len = attribute.length; i < len; i ++ ) {

						if ( attribute[ i ].if && attribute[ i ].if[ type ] !== undefined )
							keepGoing = true;

					}

				} else {

					if ( attribute.if && attribute.if[ type ] !== undefined )
						keepGoing = true;

				}

			}

			if ( keepGoing ) {

				while ( section.children.length > 1 )
					section.removeChild( section.lastChild );

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

									data[ name ] = ComponentManager.addDefault( attribute[ i ].type, attribute[ i ].default );

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

						if ( ! matchFound ) {

							// remove
							delete data[ name ];

						}

					} else {

						if ( attribute.if !== undefined && attribute.if[ type ] !== undefined ) {

							if ( attribute.if[ type ].includes( data[ type ] ) ) {

								if ( data[ name ] === undefined ) {

									// add attribute to data
									data[ name ] = ComponentManager.addDefault( attribute.type, attribute.default );

								}

							} else {

								if ( data[ name ] !== undefined ) {

									// remove attribute from data
									delete data[ name ];

								}

							}

						}

					}

				}

				for ( const name in data )
					section.appendChild( this.addFieldset( name, data, config ) );

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
				component.init( this.cloneData( data ) );
				component.enabled = true;

			}

			removeHelpers();
			addHelpers( component.entity );

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
				input.style.width = '162px';
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
				input.style.width = '162px';
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
				input.type = 'text';
				input.style.width = '162px';
				input.value = value;
				input.addEventListener( 'change', () => {

					const oldValue = data[ currentType ];
					data[ currentType ] = input.value;
					this.onInspectorChange( fieldset, type, data, oldValue, config );

				} );
				fieldset.appendChild( input );
				break;
			case 'entity': // TODO
				break;
			default:
				return console.warn( 'SidebarInspector: Invalid schema type: ' + attribute.type );

		}

		return fieldset;

	};

	const updateIcon = this.updateIcon = function ( entity, reorder ) {

		let temp;
		const children = entity.children;
		for ( let i = children.length - 1; i >= 0; i -- ) {

			if ( icons.includes( children[ i ] ) ) {

				temp = children[ i ];
				entity.remove( temp );
				break;

			}

		}

		if ( temp !== undefined ) {

			if ( reorder || box.setFromObject( entity ).isEmpty() === false )
				icons.splice( icons.indexOf( temp ), 1 );
			else
				entity.add( temp );

			if ( reorder === undefined ) return;

		}

		const components = entity.componentData;
		for ( let i = 0, len = components.length; i < len; i ++ ) {

			const type = components[ i ].type;

			if ( components[ i ].enabled === true && iconMaterials[ type ] !== undefined ) {

				if ( iconMaterials[ type ] === null ) {

					textureLoader.load( 'img/' + type + '.svg', function ( texture ) {

						iconMaterials[ type ] = new SpriteMaterial( { map: texture } );
						createSprite( entity, type );

					} );

				} else {

					createSprite( entity, type );

				}

				break;

			}

		}

		return true;

	};

	function onDragStart( event ) {

		currentDrag = this;
		event.dataTransfer.effectAllowed = 'move';

	}

	function onDragOver( event ) {

		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';

		if ( currentDrag === undefined || currentDrag.parentElement === this ) return;

		const area = event.offsetY / this.clientHeight;

		if ( area < 0.25 ) {

			this.classList.add( 'drag-above' );
			this.classList.remove( 'drag-below' );

		} else if ( area > 0.75 ) {

			this.classList.add( 'drag-below' );
			this.classList.remove( 'drag-above' );

		}

	}

	function onDrop( event ) {

		if ( currentDrag !== undefined && currentDrag.parentElement !== this ) {

			let index1, index2;
			const uuid1 = currentDrag.parentElement.dataset.uuid;
			const uuid2 = this.dataset.uuid;

			const components = currentEntity.componentData;

			for ( let i = 0, len = components.length; i < len; i ++ ) {

				if ( components[ i ].uuid === uuid1 ) index1 = i;
				else if ( components[ i ].uuid === uuid2 ) index2 = i;

				if ( index1 !== undefined && index2 !== undefined ) break;

			}

			if ( this.classList.contains( 'drag-above' ) && index1 + 1 !== index2 ) {

				this.before( currentDrag.parentElement );
				components.splice( index2, 0, components.splice( index1, 1 )[ 0 ] );

			} else if ( this.classList.contains( 'drag-below' ) && index1 - 1 !== index2 ) {

				this.after( currentDrag.parentElement );
				components.splice( index2, 0, components.splice( index1, 1 )[ 0 ] );

			}

			console.log( components );

			updateIcon( currentEntity, true );

		}

		this.classList.remove( 'drag-above', 'drag-below' );
		event.preventDefault();

	}

	function onDragLeave( event ) {

		this.classList.remove( 'drag-above', 'drag-below' );

	}

	this.addSection = function ( component, config ) {

		const data = component.data;

		const section = document.createElement( 'SECTION' );
		section.dataset.uuid = component.uuid;
		section.classList.add( 'component' );
		section.addEventListener( 'dragover', onDragOver );
		section.addEventListener( 'drop', onDrop );
		section.addEventListener( 'dragleave', onDragLeave );

		const trash = document.createElement( 'A' );
		trash.classList.add( 'trash' );
		fetch( 'img/trash.svg' ).then( r => r.text() ).then( text => {

			trash.insertAdjacentHTML( 'beforeend', text );

		} );

		const title = document.createElement( 'H1' );
		title.textContent = component.type;
		title.draggable = true;
		title.addEventListener( 'dragstart', onDragStart );
		if ( closedComponents[ component.type ] === undefined )
			title.dataset.opened = '';

		const enabled = document.createElement( 'INPUT' );
		enabled.type = 'checkbox';
		enabled.style.margin = 'auto 0 auto auto';
		if ( component.enabled ) enabled.checked = true;

		enabled.addEventListener( 'change', () => {

			component.enabled = enabled.checked;

			if ( config.runInEditor === true ) {

				const components = currentEntity.components;
				for ( let i = 0, len = components.length; i < len; i ++ ) {

					if ( components[ i ].uuid === component.uuid ) {

						components[ i ].enabled = enabled.checked;
						break;

					}

				}

				this.updateIcon( currentEntity, true );
				removeHelpers();
				addHelpers( currentEntity );
				editor.viewport.render();

			}

		} );
		title.appendChild( enabled );

		let verified = false;
		title.addEventListener( 'pointerdown', () => {

			verified = true;

		} );
		title.addEventListener( 'pointerup', ( event ) => {

			if ( ! verified ) return;

			if ( event.target.nodeName === 'INPUT' ) return;

			// trash component
			if ( event.target.classList.contains( 'trash' ) ) {

				this.removeComponent( currentEntity, component );

				const components = currentEntity.componentData;
				for ( let i = 0, len = components.length; i < len; i ++ ) {

					const dependencies = ComponentManager.components[ components[ i ].type ].config.dependencies;

					if ( dependencies !== undefined && dependencies.includes( component.type ) )
						this.removeComponent( currentEntity, components[ i ] );

				}

			} else { // minimize the component

				if ( title.dataset.opened !== undefined ) {

					// close
					// remember which components are minimized
					closedComponents[ component.type ] = true;
					delete title.dataset.opened;

				} else {

					// open up
					delete closedComponents[ component.type ];
					title.dataset.opened = '';

				}

				removeHelpers();
				addHelpers( currentEntity );

				editor.render();

			}

			verified = false;

		} );
		title.appendChild( trash );
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
					this.style.removeProperty( 'width' );
					editor.render();
					break;
				case 'color':
					document.getElementById( 'background-color' ).style.setProperty( 'display', 'inherit' );
					onColorOption( event.target );
					this.style.setProperty( 'width', '132px' );
					break;
				case 'texture':
					document.getElementById( 'background-texture' ).style.setProperty( 'display', 'inherit' );
					onTextureOption();
					this.style.setProperty( 'width', '132px' );
					break;
				case 'equirect':
					document.getElementById( 'background-equirect' ).style.setProperty( 'display', 'inherit' );
					onEquirectOption();
					this.style.setProperty( 'width', '132px' );

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
					this.style.removeProperty( 'width' );
					break;
				case 'texture':
					document.getElementById( 'environment-texture' ).style.setProperty( 'display', 'inherit' );
					onEnvironmentOption();
					this.style.setProperty( 'width', '132px' );
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
					this.style.removeProperty( 'width' );
					editor.render();
					break;
				case 'linear':
					document.getElementById( 'linear-fog' ).style.setProperty( 'display', 'flex' );
					this.style.setProperty( 'width', '132px' );
					linearColor.style.setProperty( 'display', 'inherit' );
					setFog();
					break;
				case 'exponential':
					document.getElementById( 'exponential-fog' ).style.setProperty( 'display', 'flex' );
					this.style.setProperty( 'width', '132px' );
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
		type.style.marginLeft = '8px';
		type.style.width = '100%';
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
		enabled.style.width = '162px';
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

				const multiple = ComponentManager.components[ type ].config.multiple;
				const componentData = entity.componentData;
				if ( multiple !== true && componentData !== undefined ) {

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

		} );

		componentSelector.addEventListener( 'focusout', () => {

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

		const componentData = entity.componentData;

		const component = { type, data, uuid: MathUtils.generateUUID(), enabled: true };
		const config = ComponentManager.components[ type ].config;
		const schema = config.schema;
		const runInEditor = config.runInEditor === true;

		if ( schema !== undefined ) ComponentManager.sanitizeData( component.data, schema );

		if ( config.dependencies !== undefined ) {

			for ( let i = 0, len = config.dependencies.length; i < len; i ++ ) {

				const type = config.dependencies[ i ];
				let found = false;

				for ( let i = 0, len = componentData.length; i < len; i ++ ) {

					if ( componentData[ i ].type === type ) {

						found = true;
						break;

					}

				}

				if ( found === false ) this.addComponent( entity, type );

			}

		}

		if ( runInEditor ) {

			const _component = entity.addComponent( type, this.cloneData( data ) );

			// for components that require loading
			_component.addEventListener( 'load', editor.render );


			// used by editor to select component by uuid (maybe standardize to TARO engine?)
			_component.uuid = component.uuid;

		}

		if ( entity === currentEntity ) {

			inspector.appendChild( this.addSection( component, config ) );

		}

		entity.componentData.push( component );
		this.updateIcon( entity );

		editor.render();

	};

	this.removeComponent = function ( entity, component ) {

		const config = ComponentManager.components[ component.type ].config;

		const index = entity.componentData.indexOf( component );
		entity.componentData.splice( index, 1 );

		if ( config.runInEditor === true ) {

			const components = entity.components;
			for ( let i = 0, len = components.length; i < len; i ++ ) {

				if ( components[ i ].uuid === component.uuid ) {

					entity.removeComponent( components[ i ] );
					break;

				}

			}

		}

		const children = entity.children;
		for ( let i = 0, len = children.length; i < len; i ++ ) {

			if ( icons.includes( children[ i ] ) && children[ i ].name === component.type ) {

				icons.splice( icons.indexOf( children[ i ] ), 1 );
				entity.remove( children[ i ] );

				break;

			}

		}

		this.updateIcon( entity );

		if ( currentEntity === entity ) {

			document.getElementById( 'inspector' ).querySelector( 'section[data-uuid="' + component.uuid + '"]' ).remove();

		}

		editor.viewport.render();

	};

	function createSprite( entity, type ) {

		const sprite = new Sprite( iconMaterials[ type ] );
		sprite.name = type;
		icons.push( sprite );
		entity.add( sprite );
		editor.render();

	}

	this.addSceneSection();

}
