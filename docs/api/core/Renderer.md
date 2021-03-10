[WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) ›

# Renderer

Interface into the Renderer system used by App.

## Constructor

### Renderer( parameters : <span class="param">Object</span> )
**parameters** — Object with properties defining the system's behaviour. See [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) for a list of all renderer parameters. The following are additional parameters:

**pixelRatio** — This can be used to override the window.devicePixelRatio used in the renderer.

## Properties

See the base [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) class for common properties.

### .<a>scene</a> : <span class="param">[Scene](api/core/Scene)</span>
The current scene being renderered.

### .<a>cameras</a> : <span class="param">Array</span>
Array with all Camera components.

### .<a>observer</a> : <span class="param">ResizeObserver</span>
ResizeObserver used to detect canvas resizing.

## Methods

See the base [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) class for common properties.

### .<a>dispose</a> () : <span class="param">null</span>
Dispose of the current rendering context and observer.

## Source
[src/core/Renderer.js](https://github.com/Cloud9c/taro/blob/master/src/core/Renderer.js)