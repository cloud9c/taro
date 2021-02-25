# Geometry
A representation of mesh, line, or point geometry. Includes vertex positions, face indices, normals, colors, UVs, and custom attributes within buffers, reducing the cost of passing all this data to the GPU. This is a wrapper class around three.js's [geometry](https://threejs.org/docs/#api/en/core/BufferGeometry) classes.

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
| viewport | Number of segmented faces on the z-axis        | [0, 0, 1, 1]  |

### Perspective Parameters

| Property   | Description                                                                    | Default Value |
|------------|--------------------------------------------------------------------------------|---------------|
| aspect     | Camera frustum aspect ratio. autoAspect must be **false**.                     | 1             |
| autoAspect | Automatically calculate aspect ratio from the canvas's width / height.         | true          |
| fov        | Camera frustum vertical field of view, from bottom to top of view, in degrees. | 50            |

### Orthographic Parameters

| Property   | Description                  | Default Value |
|------------|------------------------------|---------------|
| bottom     | Camera frustum bottom plane. | -1            |
| left       | Camera frustum left plane.   | -1            |
| right      | Camera frustum right plane.  | 1             |
| top        | Camera frustum top plane.    | 1             |

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
[src/core/Geometry.js](https://github.com/Cloud9c/taro/blob/master/src/components/Geometry.js)