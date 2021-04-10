[Component](api/core/Component) ›

# Rigidbody
Control of an object's position through physics simulation. This is a wrapper class around the cannon-es [Body](https://pmndrs.github.io/cannon-es/docs/classes/constraint.html) class.

**Dynamic** bodies are fully simulated. They can be moved manually in code, but normally they move according to forces like gravity or reactionary collision forces.

**Kinematic** bodies move under simulation only according to their velocity. Kinematic bodies will not respond to forces like gravity. They can be moved manually by the user, but normally they are moved by setting their velocities.

**Static** bodies does not move under simulation and they behave as if they have infinite mass. Static bodies can be moved manually by the user, but they do not accept the application of velocity.

## Code Example

```javascript
var entity = new Entity();
entity.addComponent('rigidbody', {
	type: 'dynamic',
	mass: 5
});
```

## Events

### error
Fires when an asset failed to load. Property `event` is provided (XMLHttpRequest error event).

### load
Fires when an asset failed to load. Property `material` is provided (loaded material).

### progress
Fires when an asset is loaded. Property `event` is provided (XMLHttpRequest progress event).

## .ref Events

### collide
Fires when the body collides with another body. Properties `body` and `contact` are provided (cannon-es ContactEquation).

### sleep
Fires after the body has fallen asleep.

### sleepy
Fires after the body has gone in to the sleepy state.

### wakeup
Fires after the sleeping body has woken up.

## Data Parameters

| Property             | Description                                                          | Default Value |
|----------------------|----------------------------------------------------------------------|---------------|
| collisionFilterGroup | The collision group the body belongs to.                             | 1             |
| collisionFilterMask  | The collision group the body can collide with.                       | -1            |
| collisionResponse    | Whether to produce contact forces when in contact with other bodies. | true          |
| type                 | Dynamic, kinematic, or static.                                       | "dynamic"     |
| material             | URL or path to a contact material                                    | ""            |

### dynamic

| Property        | Description                                                                                                                                      | Default Value |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| angularDamping  | How much to damp the body angular velocity each step. It can go from 0 to 1.                                                                     | 0.01          |
| angularFactor   | Use this property to limit the rotational motion along any world axis. [1, 1, 1] will allow rotation along all axes while [0, 0, 0] allows none. | [0, 0, 0]     |
| angularVelocity | Angular velocity of the body in world space. The length of this vector determines how fast (in radians per second) the body rotates.             | [0, 0, 0]     |
| fixedRotation   | Set to true if you don't want the body to rotate. Make sure to run .ref.updateMassProperties() if you change this after the body creation.       | false         |
| linearDamping   | How much to damp the body velocity each step. It can go from 0 to 1.                                                                             | 0.01          |
| linearFactor    | Use this property to limit the motion along any world axis. [1, 1, 1] will allow motion along all axes while [0, 0, 0] allows none.              | [0, 0, 0]     |
| mass            | The mass of the body.                                                                                                                            | 1             |
| sleepSpeedLimit | If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.                                               | 0.1           |
| sleepTimeLimit  | If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.                                                          | 1             |
| velocity        | World space velocity of the body.                                                                                                                | [0, 0, 0]     |

### kinematic

All dynamic parameters except for **mass**.

### static
No additional parameters.

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>ref</a> : <span class="param">[Body](https://pmndrs.github.io/cannon-es/docs/classes/body.html)</span>
Reference to the cannon-es [Body](https://pmndrs.github.io/cannon-es/docs/classes/body.html) classes.

### .<a>type</a> : <span class="param">String</span>
The rigidbody type as determined by the data parameters. Modifying this property does not change the rigidbody type.

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/components/physics/Rigidbody.js](https://github.com/Cloud9c/taro/blob/master/src/components/physics/Rigidbody.js)