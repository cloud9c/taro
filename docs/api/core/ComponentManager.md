# ComponentManager
Object used to register and store component definitions.

## Code Example
```javascript
// shortcut: TARO.registerComponent
TARO.ComponentManager.registerComponent('playerHealth', class PlayerHealth {
	init( data ) {
		this.health = data.health;
	}

	update() {
		if (this.health <= 0) {
			console.log('Player is dead!')
		}
	}

	static config = {
		dependencies: ['geometry', 'material'],
		multiple: false,
		schema: {
			health: { type: 'number', default: 10, min: 1, max: 100  }
		}
	}
})
```

## Properties

### .<a>components</a> : <span class="param">Array</span>
An object that holds registered component definitions.

## Methods

### .<a>registerComponent</a> ( type : <span class="param">String</span>, definition : <span class="param">Object</span> ) : <span class="param">null</span>
**type** — component type.<br>
**definition** — constructor function or ES6 class.

## Config
config is a special static property that can be added to the definition to indicate special behaviour:

**dependencies** — array of components that are automatically added as dependencies.<br>
**multiple** — allows for a component to have multiple instances of itself on an entity.<br>
**schema** — sanitizes the init data. Also used by Taro Editor to display data properties.

### Schema
The schema is an object that defines and describes the property or properties of the component. The schema’s keys are the names of the property, and the schema’s values define the types and values of the property

| Schema Type | Description | Default Value |
| ----------- | ----------- | ----------- |
| asset | For URLs pointing to assets. | '' |
| boolean   | True or false | false |
| color   | Converted from a string to a [Color](https://threejs.org/docs/#api/en/math/Color) | #ffffff |
| entity   | Finds a entity with a matching uuid | '' |
| int | A whole number | 0 |
| number | A float number | 0 |
| select   | Default value from a list | null |
| string | Text | '' |
| vector2 | Array to [Vector2](https://threejs.org/docs/#api/en/math/Vector2) | [0, 0] |
| vector3 | Array to [Vector3](https://threejs.org/docs/#api/en/math/Vector3) | [0, 0, 0] |
| vector4 | Array to [Vector4](https://threejs.org/docs/#api/en/math/Vector4) | [0, 0, 0, 0] |

The schema will try to infer a property type given only a default value:
```javascript
schema: {
	health: {default: 10},  // type: "number"
	name: {default: "foo"},  // type: "string"
	hairColor: {default: '#000000'}  // type: "color"
}
```
The schema will set a default value if not provided, given the property type:
```javascript
schema: {
	health: {type: 'number'},  // default: 0
	name: {type: "string"},  // default: ''
	hairColor: {type: 'color'}  // default: '#ffffff'
}
```

Additional values for Taro Editor:<br>
**min** — minimum allowed value for number/int (optional).<br>
**max** — maximum allowed value for number/int (optional).<br>
**select** — array of options for select type (required).

## Source
[src/core/ComponentManager.js](https://github.com/Cloud9c/taro/blob/master/src/core/ComponentManager.js)