import { MathUtils, ComponentManager, Vector4, Vector3, Vector2, Color } from '../../build/taro.js';

export function SidebarInspector( editor ) {

	const inspector = document.getElementById( 'inspector' );
	let currentEntity = null;

	this.attach = function ( entity ) {

		if ( currentEntity !== null ) this.detach();
		currentEntity = entity;

		this.addDefaultSection( entity );

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

		while ( inspector.firstChild !== null ) inspector.removeChild( inspector.lastChild );

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

						console.log( name, oldExit, newExit );

						if ( oldExit && ! newExit ) {

							// add
							data[ name ] = ComponentManager.addDefault( attribute[ i ].type, attribute[ i ].default );
							section.appendChild( this.addFieldset( name, data, config ) );
							matchFound = true;
							break;

						} else if ( ! oldExit && ! newExit ) {

							matchFound = true;
							break;

						}

					}

				}

				if ( ! matchFound && data[ name ] !== undefined ) {

					// remove
					delete data[ name ];
					console.log( section, name );
					section.querySelector( 'fieldset[data-type="' + name + '"]' ).remove();

				}

			} else {

				if ( attribute.if !== undefined && attribute.if[ type ] !== undefined ) {

					if ( attribute.if[ type ].includes( data[ type ] ) ) {

						if ( data[ name ] === undefined ) {

							// add attribute to data
							data[ name ] = ComponentManager.addDefault( attribute.type, attribute.default );
							section.appendChild( this.addFieldset( name, data, config ) );

						}

					} else if ( data[ name ] !== undefined ) {

						console.log( name );
						// remove attribute from data
						delete data[ name ];
						section.querySelector( 'fieldset[data-type="' + name + '"]' ).remove();

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
					input.style.width = '87px';
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
				div.style = 'display: flex;flex-wrap: wrap;width:174px';
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
				input.style.width = '174px';
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
		section.appendChild( title );

		const schema = config.schema;

		if ( schema !== undefined ) {

			for ( const type in data ) {

				section.appendChild( this.addFieldset( type, data, config ) );

			}

		}

		return section;

	};

	this.addDefaultSection = function ( entity ) {

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
		type.value = entity.type;
		type.style = 'margin-left: 8px;width: 100%;';
		type.addEventListener( 'change', function () {

			entity.type = this.value;
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
		div.style = 'display:flex;align-items:center;width:174px';

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
		enabled.style.width = '174px';
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

			this.addComponent( event.target.textContent );

		} );

		section.appendChild( componentSelector );
		section.appendChild( componentList );

		inspector.appendChild( section );

	};

	this.addComponent = function ( type ) {

		if ( currentEntity.componentData === undefined ) currentEntity.componentData = [];

		const component = { type, data: {}, uuid: MathUtils.generateUUID() };
		const config = ComponentManager.components[ type ].config;
		const schema = config.schema;
		const runInEditor = config.runInEditor === true;

		if ( schema !== undefined ) {

			ComponentManager.sanitizeData( component.data, schema );
			inspector.appendChild( this.addSection( component, config ) );

		}

		if ( runInEditor ) {

			const _component = currentEntity.addComponent( type, component.data );
			_component.uuid = component.uuid;

		}

		currentEntity.componentData.push( component );
		editor.render();

	};

}
