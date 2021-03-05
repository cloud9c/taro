[Component](api/core/Component) ›

# Light
This is a wrapper class around three.js [Light](https://threejs.org/docs/#api/en/lights/Light) classes.

- **Ambient** light globally illuminates all objects in the scene equally.
- **Directional** light gets emitted in a specific direction.
- **Hemisphere** light is a light source positioned directly above the scene, with color fading from the sky color to the ground color.
- **Point** light gets emitted from a single point in all directions.
- **Spot** light gets emitted from a single point in one direction, along a cone that increases in size the further from the light it gets.

## Code Example

```javascript
var entity = new Entity();
entity.addComponent('light', {
	type: 'ambient',
	color: 0xffffff,
	intensity: 0.5
});
```

## Data Parameters

| Property  | Description                                              | Default Value |
|-----------|----------------------------------------------------------|---------------|
| color     | Hexadecimal color of the light (not used by hemisphere). | 0xffffff      |
| intensity | Numeric value of the light's strength/intensity.         | 1             |
| type      | One of five light types.                                 | "ambient"     |

### hemisphere

| Property    | Description                      | Default Value |
|-------------|----------------------------------|---------------|
| skyColor    | Hexadecimal color of the sky.    | 0xffffff      |
| groundColor | hexadecimal color of the ground. | 0xffffff      |

### point

| Property | Description                                                | Default Value |
|----------|------------------------------------------------------------|---------------|
| distance | Maximum range of the light (0 represents no limit).        | 0             |
| decay    | The amount the light dims along the distance of the light. | 1             |

### spot

| Property | Description                                                                      | Default Value |
|----------|----------------------------------------------------------------------------------|---------------|
| distance | Maximum range of the light (0 represents no limit).                              | 0             |
| angle    | Maximum angle of light dispersion from its direction (upper bound is Pi/2). | Pi/3          |
| penumbra | Percent of the spotlight cone that is attenuated due to penumbra (0-1).          | 0             |
| decay    | The amount the light dims along the distance of the light.                       | 1             |

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>ref</a> : <span class="param">[Light](https://threejs.org/docs/#api/en/lights/Light)</span>
Reference to three.js [Light](https://threejs.org/docs/#api/en/lights/Light) classes.

### .<a>type</a> : <span class="param">String</span>
The light type as determined by the data parameters. Modifying this property does not change the light type.

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/components/Light.js](https://github.com/Cloud9c/taro/blob/master/src/components/Light.js)