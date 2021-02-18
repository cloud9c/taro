# App

## Constructor

### App( parameters : <span class="param">Object</span> )

<a>parameters</a> - (optional) object with properties defining the app's behaviour for [Renderer](api/core/Renderer), [Time](api/core/Time), and [Physics](api/core/Physics). The constructor also accepts no parameters at all. In all cases, it will assume defaults when parameters are missing. The following are additional parameters:

<a>renderer</a> - This can be used to attach the app to an existing [Renderer](api/core/Renderer). Default is **undefined**.

## Properties

### .<a>assets</a> : <span class="param">[AssetManager](api/core/AssetManager)</span>
Provides access to user-defined or component-added assets.

### .<a>currentScene</a> : <span class="param">[Scene](api/core/Scene)</span>
The scene that is currently active in the app. Default is **undefined**.

### .<a>domElement</a> : <span class="param">DOMElement</span>
A canvas where the renderer draws its output. This is automatically created by the renderer in the constructor (if not provided already).

### .<a>input</a> : <span class="param">[Input](api/core/Input)</span>
Reference to the input system.

### .<a>parameters</a> : <span class="param">Object</span>
The same parameter object used in the app constructor. Any modification after instantiation does not change the app.

### .<a>physics</a> : <span class="param">[Physics](api/core/Physics)</span>
Reference to the physics system.

### .<a>renderer</a> : <span class="param">[Renderer](api/core/Renderer)</span>
Reference to the renderer.

### .<a>scenes</a> : <span class="param">Array</span>
Array with app's scenes.

### .<a>time</a> : <span class="param">[Time](api/core/Time)</span>
Reference to the time system.

## Static Properties

### .<a>currentApp</a> : <span class="param">[App](api/core/App)</span>
The most recent app created; scenes created without a specified app uses this property.

## Methods
