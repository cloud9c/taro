[Object3D](https://threejs.org/docs/#api/en/core/Object3D) ›

# Entity
Entities are placeholder objects that act as containers for components to provide them appearance, behavior, and functionality. By default, they are attached with position, rotation, and scale properties. Note that .children returns children entities and Object3Ds, while .getEntities() returns just children entities.

## Constructor

### Entity( name : <span class="param">String</span>, parent : <span class="param">Object</span> )
**name** — (optional) Sets the .name property.<br>
**parent** — (optional) Sets the parent entity or scene. If a parent is not provided, the currentScene will act as the parent. **false** can be passed to specify no parenting.

## Events

### disable
Fires when the entity is disabled.

### enable
Fires when the entity is enabled.

### sceneadd
Fires when a root scene is added.

### sceneremove
Fires when a root scene is removed.

## Properties

See the base [Object3D](https://threejs.org/docs/#api/en/core/Object3D) class for common properties.

### .<a>app</a> : <span class="param">[App](api/core/App)</span>
The app the entity is attached to.

### .<a>castShadow</a> : <span class="param">Boolean</span>
Whether the object gets rendered into shadow map. Default is **true**.

### .<a>components</a> : <span class="param">Array</span>
Array with entity's components.

### .<a>enabled</a> : <span class="param">Boolean</span>
Disabling the entity disables all children entities and components. Default is **true**.

### .<a>queue</a> : <span class="param">Array</span>
Array with components still in queue to be initialized (empties when a root scene is added).

### .<a>receiveShadow</a> : <span class="param">Boolean</span>
Whether the material receives shadows. Default is **true**.

### .<a>scene</a> : <span class="param">[Scene](api/core/Scene)</span>
The root scene of the entity in the [Scene Graph](https://en.wikipedia.org/wiki/Scene_graph)

## Methods

See the base [Object3D](https://threejs.org/docs/#api/en/core/Object3D) class for common methods.

### .<a>getComponent</a> ( type : <span class="param">String</span> ) : <span class="param">[Component](api/core/Component)</span>
Returns the component of **type** if the entity has one attached.

### .<a>getComponents</a> ( type : <span class="param">String</span> ) : <span class="param">[Component](api/core/Component)</span>
Returns all components of **type** in the entity.

### .<a>addComponent</a> ( type : <span class="param">String</span>, data : <span class="param">Object</span> ) : <span class="param">[Component](api/core/Component)</span>
Adds a component class of **type** to the entity with a **data** parameter.

### .<a>removeComponent</a> ( component : <span class="param">[Component](api/core/Component)</span> ) : <span class="param">this</span>
Removes **component** from the entity.

### .<a>traverseEntities</a> ( callback : <span class="param">Function</span> ) : <span class="param">null</span>
callback — A function with as first argument an entity.

Executes the callback on this object and all descendants.<br>
Note: Modifying the scene graph inside the callback is discouraged.

### .<a>getEntities</a> () : <span class="param">Array</span>
Returns an array of children entities. Use this function instead of the .children property to filter out non-entities.

### .<a>getEntityById</a> ( id : <span class="param">Integer</span> ) : <span class="param">[Entity](api/core/Entity)</span>
**id** — Unique number of the entity instance.

Searches through an entity and its children entities, starting with the entity itself, and returns the first with a matching id.
Note that ids are assigned in chronological order: 1, 2, 3, ..., incrementing by one for each new object.

### .<a>getEntityByName</a> ( name : <span class="param">String</span> ) : <span class="param">[Entity](api/core/Entity)</span>
**name** — String to match to the name property.

Searches through an entity and its children entities, starting with the entity itself, and returns the first with a matching name.
Note that for most entities the name is an empty string by default.

### .<a>getEntityByProperty</a> ( name : <span class="param">String</span>, value : <span class="param">Float</span> ) : <span class="param">[Entity](api/core/Entity)</span>
**name** — The property name to search for.<br>
**value** — Value of the given property.

Searches through an entity and its children entities, starting with the entity itself, and returns the first with a property that matches the value given.

## Source
[src/core/Entity.js](https://github.com/Cloud9c/taro/blob/master/src/core/Entity.js)