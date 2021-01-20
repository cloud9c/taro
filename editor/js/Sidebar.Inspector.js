import { MathUtils, ComponentManager } from '../../build/taro.js';

export function SidebarInspector( editor ) {

	const inspector = document.getElementById( 'inspector' );
	let currentEntity = null;

	this.attach = function ( entity ) {

		if ( currentEntity !== null ) this.detach();
		currentEntity = entity;

		this.addDefaultUI( entity );

		const components = entity.componentData;

		if ( components !== undefined ) {

			for ( let i = 0, len = components.length; i < len; i ++ ) {

				const config = ComponentManager.components[ components[ i ].type ].config;
				inspector.appendChild( this.addUI( config, components[ i ] ) );

			}

		}

	};

	this.detach = function () {

		currentEntity = null;

		while ( inspector.firstChild !== null ) inspector.removeChild( inspector.lastChild );

	};

	this.addUI = function ( config, componentData ) {

		const section = document.createElement( 'SECTION' );
		section.classList.add( 'component' );

		const title = document.createElement( 'H1' );
		title.textContent = componentData.type;
		section.appendChild( title );

		const schema = config.schema;
		console.log( schema );
		for ( name in schema ) {

			const fieldset = document.createElement( 'FIELDSET' );
			const legend = document.createElement( 'LEGEND' );
			const attribute = schema[ name ];

			console.log( attribute );

			switch ( attribute.type ) {

				case 'string':
					const input = document.createElement( 'INPUT' );
					input.type = 'text';
					legend.textContent = attribute.label !== undefined ? attribute.label : name;
					fieldset.appendChild( input );
					break;
				case 'color':
					break;
				case 'vector2':
					break;
				case 'vector3':
					break;
				case 'vector4':
					break;
				case 'boolean':
					break;
				case 'slider':
					break;
				case 'number':
					break;
				case 'int':
					break;
				case 'select':
					break;
				case 'asset':
					break;
				default:
					return console.warn( 'SidebarInspector: Invalid schema type: ' + attribute.type );

			}

			fieldset.appendChild( legend );
			section.appendChild( fieldset );

		}

		return section;

	};

	this.addDefaultUI = function ( entity ) {

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

		const name = document.createElement( 'INPUT' );
		name.type = 'text';
		name.value = entity.name;
		name.style = 'margin-left: 8px;width: 100%;';
		name.addEventListener( 'change', function () {

			entity.name = this.value;
			document.querySelector( '#scene-tree div[data-id="' + entity.id + '"' ).textContent = this.value;
			editor.render();

		} );
		fieldset.appendChild( name );
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
				input.style.width = '58px';
				if ( xyz[ j ] === 'y' ) input.style.margin = '0 6px';

				if ( translation[ i ] === 'rotation' ) {

					input.addEventListener( 'input', function () {

						entity[ translation[ i ] ][ xyz[ j ] ] = MathUtils.degToRad( parseFloat( this.value ) );
						editor.render();

					} );

				} else {

					input.addEventListener( 'input', function () {

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
		div.style = 'display:flex;align-items:center;width:186px';

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
		enabled.style.width = '186px';
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

			const components = ComponentManager.components;
			for ( const type in components ) {

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

		const component = { type, data: {} };
		const config = ComponentManager.components[ type ].config;
		const schema = config.schema;
		const runInEditor = config.runInEditor === true;

		if ( schema !== undefined ) {

			ComponentManager.sanitizeData( component.data, schema );
			inspector.appendChild( this.addUI( config, component ) );

		}

		if ( runInEditor ) currentEntity.addComponent( type, component.data );

		currentEntity.componentData.push( component );
		editor.render();

	};

}
