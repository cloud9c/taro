# Camera
A Camera is a device through which the player views the world. This is a wrapper class around three.js's [PerspectiveCamera](https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera) and [OrthographicCamera](https://threejs.org/docs/index.html#api/en/cameras/OrthographicCamera).

Perspective projection is designed to mimic the way the human eye sees. It is the most common projection mode used for rendering a 3D scene.

In orthographic projection, an object's size in the rendered image stays constant regardless of its distance from the camera. This can be useful for rendering 2D scenes and UI elements, amongst other things.

## Data Parameters

**type** — Either perspective or orthographic. Default is **perspective**.<br>
**near** — Camera frustum near plane. Default is **0.1**.<br>
**far** — Camera frustum far plane. Default is **2000**. Must be greater than the current value of near plane.<br>

### Perspective Parameters

**aspect** — Camera frustum aspect ratio, usually the canvas width / canvas height. autoAspect must be **false**. Default is 1.<br>
**autoAspect** — Camera frustum near plane. Default is **0.1**.<br>
**fov** — Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is **50**.<br>

## Properties

## Methods

## Source
[src/core/Camera.js](https://github.com/Cloud9c/taro/blob/master/src/components/Camera.js)