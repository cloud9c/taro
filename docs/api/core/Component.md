# Component

Component is the base class from which every Taro script derives. Components can be mixed, matched, and composed onto entities to build appearance, behavior, and functionality.

## Constructor

See [ComponentManager](api/core/ComponentManager) to learn how to register custom components.

## Events

### disable
Fires when the component is disabled.

### enable
Fires when the component is enabled.

## Properties

### .<a>app</a> : <span class="param">[App](api/core/App)</span>
The app the component is attached to.

### .<a>componentType</a> : <span class="param">String</span>
Returns the component type.

### .<a>enabled</a> : <span class="param">Boolean</span>
Enabled components are updated, disabled components are not. A component cannot be enabled if their entity is disabled. Default is **true**.

### .<a>entity</a> : <span class="param">[Entity](api/core/Entity)</span>
The entity the component is attached to. A component is always attached to an entity.

### .<a>scene</a> : <span class="param">[Scene](api/core/Scene)</span>
The scene the component is attached to.

### .<a>uuid</a> : <span class="param">String</span>
UUID of this component instance. This gets automatically assigned, so this shouldn't be edited.

## Methods

### .<a>init</a> ( data : <span class="param">Object</span> ) : <span class="param">null</span>
Called when the component instance is being added. Data parameters can be sanitized/standardized using a [schema](api/core/ComponentManager?id=schema).

### .<a>fixedUpdate</a> () : <span class="param">null</span>
Called every fixed framerate frame if the component is enabled. fixedUpdate should be used instead of update when dealing with physics calculations.

### .<a>update</a> ( deltaTime : <span class="param">Float</span> ) : <span class="param">null</span>
Called every frame if the component is enabled.