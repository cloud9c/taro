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

		for ( let i = 0, len = defaultSchema.length; i < len; i ++ )
			this.addUI( defaultSchema[ i ] );

		const components = entity.componentData;

		if ( components !== undefined )
			for ( let i = 0, len = components.length; i < len; i ++ ) {

				const schema = componentManager.components[ components[ i ].type ].options.schema;
				if ( schema !== undefined )
					this.addUI( schema, components[ i ] );

			}

	};

	this.detach = function () {

		currentEntity = null;

		while ( inspector.firstChild ) inspector.removeChild( inspector.lastChild );

	};

	this.addUI = function ( schema, componentData ) {

		const fieldset = document.createElement( 'FIELDSET' );

		switch ( schema.type ) {

			case 'string':
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

		inspector.appendChild( fieldset );

	};

	this.addComponent = function ( type ) {

		if ( currentEntity.componentData === undefined ) currentEntity.componentData = [];

		const data = { type: type };
		const schema = componentManager.components[ type ].options.schema;
		if ( schema !== undefined )
			for ( let i = 0, len = schema.length; i < len; i ++ ) {

				const _default = schema[ i ].default;
				let value;

				switch ( schema[ i ].type ) {

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
						return console.warn( 'SidebarInspector: Invalid schema type: ' + schema.type );

				}

				data[ schema[ i ].name ] = value;

			}

		currentEntity.componentData.push( data );
		this.addUI();

	};

}
