[Component](api/core/Component) ›

# Model
Loads a 3D model using a glTF (.gltf or .glb), draco (.drc), or three.js object (.json or .3obj) file.

## Code Example

```javascript
var entity = new Entity();
entity.addComponent('model', {
	asset: './model.gltf'
});
```

## Data Parameters

| Property | Description                                                     | Default Value |
|----------|-----------------------------------------------------------------|---------------|
| asset    | Model url or instance with gLTF, draco, or three.js extensions. | ""            |

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>ref</a> : <span class="param">[Object3D](https://threejs.org/docs/#api/en/core/Object3D)</span>
Reference to the imported 3D model.

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/components/Model.js](https://github.com/Cloud9c/taro/blob/master/src/components/Model.js)