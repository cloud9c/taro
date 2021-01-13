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

		inspector.appendChild( this.addDefaultUI() );

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
			const attribute = schema[ i ];

			switch ( attribute.type ) {

				case 'string':
					const input = document.createElement( 'INPUT' );
					const legend = document.createElement( 'LEGEND' );
					input.type = 'text';
					legend.textContent = attribute.label !== undefined ? attribute.label : attribute.name;
					fieldset.appendChild( legend );
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

			section.appendChild( fieldset );

		}

		return section;

	};

	this.addDefaultUI = function () {

		const section = document.createElement( 'SECTION' );
		let fieldset, enabled, name;

		fieldset = document.createElement( 'FIELDSET' );

		enabled = document.createElement( 'INPUT' );
		enabled.type = 'checkbox';
		name = document.createElement( 'INPUT' );
		name.type = 'text';

		fieldset.appendChild( enabled );
		fieldset.appendChild( name );

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
