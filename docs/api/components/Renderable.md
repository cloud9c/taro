[Component](api/core/Component) ›

# Renderable
Loads any three.js object into the scene hierarchy.

## Code Example

```javascript
var entity = new Entity();
var object = new Object3D();
entity.addComponent('model', object);
```

## Data parameters

Data is any three.js object (Light, Camera, Mesh, Object3D, etc.).

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>ref</a> : <span class="param">[Object3D](https://threejs.org/docs/#api/en/core/Object3D)</span>
Reference to the three.js object given in the parameters.

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/components/Renderable.js](https://github.com/Cloud9c/taro/blob/master/src/components/Renderable.js)