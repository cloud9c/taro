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

				switch ( schema[ i ].type ) {

					case 'string':
						const value = _default !== undefined ? _default : "";
						break;
					case 'color':
						const value = _default !== undefined ? _default : 0x000000;
						break;
					case 'vector2':
						const value = _default !== undefined ? _default : {x: 0, y: 0};
						break;
					case 'vector3':
						const value = _default !== undefined ? _default : {x: 0, y: 0, z: 0};
						break;
					case 'vector4':
						const value = _default !== undefined ? _default : {x: 0, y: 0, z: 0, w: 0};
						break;
					case 'boolean':
						const value = _default !== undefined ? _default : false;
						break;
					case 'slider':
						const value = _default !== undefined ? _default : 0;
						break;
					case 'number':
						const value = _default !== undefined ? _default : 0;
						break;
					case 'select':
						const value = _default !== undefined ? _default : [];
						break;
					case 'asset':
						const value = _default !== undefined ? _default : null;
						break;
					default:
						return console.warn( 'SidebarInspector: Invalid schema type: ' + schema.type );

				}

				data[schema[i].name] = value;

			}

		currentEntity.componentData.push( data );
		this.addUI();

	};

}
