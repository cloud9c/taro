import { MathUtils } from '../../build/taro.js';

const defaultSchema = [
	{
		name: 'name',
		label: 'Name',
		type: 'string',
		onChange: function ( event, entity ) {

			entity.name = event.target;

		}
	}
];

export function SidebarInspector( editor ) {

	const inspector = document.getElementById( 'inspector' );
	const componentManager = editor.app.componentManager;
	let currentEntity = null;

	this.attach = function ( entity ) {

		if ( currentEntity !== null ) this.detach();
		currentEntity = entity;

		inspector.appendChild( this.addDefaultUI( entity ) );

		const components = entity.componentData;

		if ( components !== undefined )
			for ( let i = 0, len = components.length; i < len; i ++ ) {

				const schema = componentManager.components[ components[ i ].type ].options.schema;
				if ( schema !== undefined )
					inspector.appendChild( this.addUI( schema, components[ i ] ) );

			}

	};

	this.detach = function () {

		currentEntity = null;

		while ( inspector.firstChild ) inspector.removeChild( inspector.lastChild );

	};

	this.addUI = function ( schema, componentData ) {

		const section = document.createElement( 'SECTION' );

		for ( let i = 0, len = schema.length; i < len; i ++ ) {

			const fieldset = document.createElement( 'FIELDSET' );
			const legend = document.createElement( 'LEGEND' );
			const attribute = schema[ i ];

			switch ( attribute.type ) {

				case 'string':
					const input = document.createElement( 'INPUT' );
					input.type = 'text';
					legend.textContent = attribute.label !== undefined ? attribute.label : attribute.name;
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
				case 'select':
					break;
				case 'asset':
					break;
				default:
					return console.warn( 'SidebarInspector: Invalid schema type: ' + schema.type );

			}

			fieldset.appendChild( legend );
			section.appendChild( fieldset );

		}

		return section;

	};

	this.addDefaultUI = function ( entity ) {

		const section = document.createElement( 'SECTION' );
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

		return section;

	};

	this.addComponent = function ( type ) {

		if ( currentEntity.componentData === undefined ) currentEntity.componentData = [];

		const component = { type, data: {} };
		const schema = componentManager.components[ type ].options.schema;
		if ( schema !== undefined )
			for ( let i = 0, len = schema.length; i < len; i ++ ) {

				const attribute = schema[ i ];
				const _default = attribute.default;
				let value;

				switch ( attribute.type ) {

					case 'string':
						value = _default !== undefined ? _default : '';
						break;
					case 'color':
						value = _default !== undefined ? _default : 0x000000;
						break;
					case 'vector2':
						value = _default !== undefined ? _default : { x: 0, y: 0 };
						break;
					case 'vector3':
						value = _default !== undefined ? _default : { x: 0, y: 0, z: 0 };
						break;
					case 'vector4':
						value = _default !== undefined ? _default : { x: 0, y: 0, z: 0, w: 0 };
						break;
					case 'boolean':
						value = _default !== undefined ? _default : false;
						break;
					case 'slider':
						value = _default !== undefined ? _default : 0;
						break;
					case 'number':
						value = _default !== undefined ? _default : 0;
						break;
					case 'select':
						value = _default !== undefined ? _default : [];
						break;
					case 'asset':
						value = _default !== undefined ? _default : null;
						break;
					default:
						return console.warn( 'SidebarInspector: Invalid schema type: ' + attribute.type );

				}

				component.data[ attribute.name ] = value;

			}

		currentEntity.componentData.push( component );
		this.addUI();

	};

}
