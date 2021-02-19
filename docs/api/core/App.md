# App
App is a collection of scenes and other core classes (Assets, Input, Physics, Renderer, Time) that defines your project.

## Constructor

### App( parameters : <span class="param">Object</span> )
**parameters** - (optional) object with properties defining the app's behaviour. The constructor also accepts no parameters at all. In all cases, it will assume defaults when parameters are missing. The following are additional parameters:

**renderer** - This can be used to attach the app to an existing [Renderer](api/core/Renderer). Default is **undefined**.

See [Renderer](api/core/Renderer), [Time](api/core/Time), and [Physics](api/core/Physics) for a list of all parameters.

## Properties

### .<a>assets</a> : <span class="param">[AssetManager](api/core/AssetManager)</span>
Provides access to user-defined or component-added assets.

### .<a>currentScene</a> : <span class="param">[Scene](api/core/Scene)</span>
The scene that is currently active in the app.

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
Array of the app's scenes.

### .<a>time</a> : <span class="param">[Time](api/core/Time)</span>
Reference to the time system.

## Static Properties

### .<a>currentApp</a> : <span class="param">[App](api/core/App)</span>
The most recent app created; scenes created without a specified app uses this property.

## Methods

### .<a>addScene</a> ( scene : <span class="param">[Scene](api/core/Scene)</span>, ... ) : <span class="param">this</span>
Adds **scene** as a part of this app. An arbitrary number of scenes may be added. Any current app on a scene passed in here will be removed, since a scene can have at most one app.

### .<a>dispose</a> () : <span class="param">null</span>
Remove the current rendering context and all the event listeners.

### .<a>getSceneById</a> ( id : <span class="param">Integer</span> ) : <span class="param">[Scene](api/core/Scene)</span>
**id** - Unique number of the scene instance

Searches through the .scenes array and returns the first with a matching id.
Note that ids are assigned in chronological order: 1, 2, 3, ..., incrementing by one for each new object.

### .<a>getSceneByName</a> ( name : <span class="param">String</span> ) : <span class="param">[Scene](api/core/Scene)</span>
**name** - String to match to the Scene.name property.

Searches through the .scenes array and returns the first with a matching name.
Note that for most scenes the name is an empty string by default.

### .<a>getSceneByProperty</a> ( name : <span class="param">String</span>, value : <span class="param">Float</span> ) : <span class="param">[Scene](api/core/Scene)</span>
**name** - the property name to search for.<br>
**value** - value of the given property.

Searches through the .scenes array and returns the first with a property that matches the value given.

### .<a>removeScene</a> ( scene : <span class="param">[Scene](api/core/Scene)</span>, ... ) : <span class="param">this</span>
Removes **scene** as a part of this app. An arbitrary number of scenes may be removed.

### .<a>setScene</a> ( scene : <span class="param">[Scene](api/core/Scene)</span> ) : <span class="param">null</span>
Sets **scene** as the active scene in the app.

### .<a>start</a> () : <span class="param">null</span>
Starts executing an update loop that will called every available frame.

### .<a>stop</a> () : <span class="param">null</span>
Stops the ongoing update loop.

### .<a>update</a> ( timestamp : <span class="param">DOMHighResTimeStamp</span> ) : <span class="param">null</span>
Updates the application. This function will update systems and call the update/fixedUpdate functions of all enabled components.
If a timestamp is not provided, the function will use performance.now().

## Source
[src/core/App.js](https://github.com/Cloud9c/taro/blob/master/src/core/App.js)