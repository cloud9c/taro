[Scene](https://threejs.org/docs/#api/en/scenes/Scene) ›

# Scene
Scenes allow you to set up what and where is to be rendered by taro.js. This is where you place objects, lights and cameras.

## Constructor

### <a>Scene</a>( name : <span class="param">String</span>, app : <span class="param">[App](api/core/ComponentManager)</span> )
**name** — (optional) Sets the .name property.<br>
**app** — (optional) Sets the root app. If an app is not provided, the currentApp will act as the root. **false** can be passed to specify no root app.

## Properties

See the base [Scene](https://threejs.org/docs/#api/en/scenes/Scene) class for common properties.

### .<a>app</a> : <span class="param">[App](api/core/App)</span>
The app the scene is attached to.

### .<a>components</a> : <span class="param">Object</span>
An object of enabled components.

## Methods

See the base [Scene](https://threejs.org/docs/#api/en/scenes/Scene) class for common methods.

### .<a>getComponent</a> ( type : <span class="param">String</span> ) : <span class="param">[Component](api/core/Component)</span>
Returns an enabled component of **type** in the scene.

### .<a>getComponents</a> ( type : <span class="param">String</span> ) : <span class="param">[Component](api/core/Component)</span>
Returns all enabled components of **type** in the scene.

### .<a>traverseEntities</a> ( callback : <span class="param">Function</span> ) : <span class="param">null</span>
callback — A function with an entity as the first argument.

Executes the callback on this object and all descendants.<br>
Note: Modifying the scene graph inside the callback is discouraged.

### .<a>getEntities</a> () : <span class="param">Array</span>
Returns an array of children entities. Use this function instead of the .children property to filter out non-entities.

### .<a>getEntityById</a> ( id : <span class="param">Integer</span> ) : <span class="param">[Entity](api/core/Entity)</span>
**id** — Unique number of the entity instance.

Searches through the scene and its children entities, starting with the entity itself, and returns the first with a matching id.
Note that ids are assigned in chronological order: 1, 2, 3, ..., incrementing by one for each new object.

### .<a>getEntityByName</a> ( name : <span class="param">String</span> ) : <span class="param">[Entity](api/core/Entity)</span>
**name** — String to match to the name property.

Searches through the scene and its children entities, starting with the entity itself, and returns the first with a matching name.
Note that for most entities the name is an empty string by default.

### .<a>getEntityByProperty</a> ( name : <span class="param">String</span>, value : <span class="param">Float</span> ) : <span class="param">[Entity](api/core/Entity)</span>
**name** — The property name to search for.<br>
**value** — Value of the given property.

Searches through the scene and its children entities, starting with the entity itself, and returns the first with a property that matches the value given.

## Source
[src/core/Scene.js](https://github.com/Cloud9c/taro/blob/master/src/core/Scene.js)