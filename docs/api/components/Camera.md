[Component](api/core/Component) ›

# Camera
A Camera is a device through which the player views the world. This is a wrapper class around three.js [PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera) and [OrthographicCamera](https://threejs.org/docs/#api/en/cameras/OrthographicCamera).

Perspective projection is designed to mimic the way the human eye sees. It is the most common projection mode used for rendering a 3D scene.

In orthographic projection, an object's size in the rendered image stays constant regardless of its distance from the camera. This can be useful for rendering 2D scenes and UI elements, amongst other things.

## Code Example

```javascript
var entity = new Entity();
entity.addComponent('camera', {
	type: 'perspective',
	near: 1,
	far: 4000,
	fov: 90
});
```

## Data Parameters

| Property | Description                                    | Default Value |
|----------|------------------------------------------------|---------------|
| type     | Either perspective or orthographic.            | "perspective" |
| near     | Height (in meters) of the sides on the Y axis. | 0.1           |
| far      | Depth (in meters) of the sides on the Z axis.  | 2000          |
| viewport | Number of segmented faces on the z-axis.       | [0, 0, 1, 1]  |

### perspective

| Property   | Description                                                                    | Default Value |
|------------|--------------------------------------------------------------------------------|---------------|
| aspect     | Camera frustum aspect ratio. autoAspect must be **false**.                     | 1             |
| autoAspect | Automatically calculate aspect ratio from the canvas's width / height.         | true          |
| fov        | Camera frustum vertical field of view, from bottom to top of view, in degrees. | 50            |

### orthographic

| Property   | Description                  | Default Value |
|------------|------------------------------|---------------|
| bottom     | Camera frustum bottom plane. | -1            |
| left       | Camera frustum left plane.   | -1            |
| right      | Camera frustum right plane.  | 1             |
| top        | Camera frustum top plane.    | 1             |

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>autoAspect</a> : <span class="param">Float</span>
Automatically calculate aspect ratio from the canvas's width / height.

### .<a>ref</a> : <span class="param">[Camera](https://threejs.org/docs/#api/en/cameras/Camera)</span>
Reference to the three.js [PerspectiveCamera](https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera) or [OrthographicCamera](https://threejs.org/docs/index.html#api/en/cameras/OrthographicCamera).

### .<a>type</a> : <span class="param">String</span>
The camera type as determined by the data parameters. Modifying this property does not change the camera type.

### .<a>viewport</a> : <span class="param">[Vector4](https://threejs.org/docs/#api/en/math/Vector4)</span>
Where on the screen is the camera rendered in normalized coordinates.

## Methods

See the base [Component](api/core/Component) class for common methods.

### .<a>updateProjectionMatrix</a> () : <span class="param">null</span>
Updates the camera projection matrix. Must be called after any change of parameters (including .viewport).

## Source
[src/components/Camera.js](https://github.com/Cloud9c/taro/blob/master/src/components/Camera.js)