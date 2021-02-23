# Camera
A Camera is a device through which the player views the world. This is a wrapper class around three.js's [PerspectiveCamera](https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera) and [OrthographicCamera](https://threejs.org/docs/index.html#api/en/cameras/OrthographicCamera).

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

**type** — Either perspective or orthographic. Default is **perspective**.<br>
**near** — Camera frustum near plane. Default is **0.1**.<br>
**far** — Camera frustum far plane. Default is **2000**. Must be greater than the current value of near plane.<br>
**viewport** — 	Where on the screen is the camera rendered in normalized coordinates. Default is **[0, 0, 1, 1]**.<br>

### Perspective Parameters

**aspect** — Camera frustum aspect ratio. autoAspect must be **false**. Default is **1**.<br>
**autoAspect** — Automatically calculate aspect ratio from the canvas's width / height. Default is **true**.<br>
**fov** — Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is **50**.<br>

### Orthographic Parameters

**bottom** — Camera frustum bottom plane. Default is **-1**.<br>
**left** — Camera frustum left plane. Default is **-1**.<br>
**right** — Camera frustum right plane. Default is **1**.<br>
**top** — Camera frustum top plane. Default is **1**.<br>

## Properties

### .<a>autoAspect</a> : <span class="param">Float</span>
Automatically calculate aspect ratio from the canvas's width / height.

### .<a>ref</a> : <span class="param">Object</span>
Reference to the three.js [PerspectiveCamera](https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera) or [OrthographicCamera](https://threejs.org/docs/index.html#api/en/cameras/OrthographicCamera).

### .<a>type</a> : <span class="param">String</span>
The camera type as determined by the data parameters. Modifying this property does not change the camera type.

### .<a>viewport</a> : <span class="param">[Vector4](https://threejs.org/docs/#api/en/math/Vector4)</span>
Where on the screen is the camera rendered in normalized coordinates.

## Methods

### .<a>updateProjectionMatrix</a> () : <span class="param">null</span>
Updates the camera projection matrix. Must be called after any change of parameters (including .viewport).

## Source
[src/core/Camera.js](https://github.com/Cloud9c/taro/blob/master/src/components/Camera.js)