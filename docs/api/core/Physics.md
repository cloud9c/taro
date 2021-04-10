[World](https://pmndrs.github.io/cannon-es/docs/classes/world.html) ›

# Physics

Interface into the Physics system used by App.

## Constructor

### Physics( parameters : <span class="param">Object</span> )
**parameters** — Object with properties defining the system's behaviour. In all cases, it will assume defaults when parameters are missing. The following are valid parameters:

**allowSleep** — Whether or not to implement sleeping optimization. Default is **true**.<br>
**epsilon** — The difference between one and the smallest value greater than one that can be represented as a Number. Used for keeping [Body](https://pmndrs.github.io/cannon-es/docs/classes/body.html) and [Entity](api/core/Entity) in sync. Default is **0.001**.<br>
**gravity** — The gravity applied to all rigidbodies in the scene. Default is **(0, - 9.80665, 0)**.

## Events

## addBody
Fires when a rigidbody is added to the world. Property `body` is provided.

### beginContact
Fires when two rigidbodies begin to contact. Properties `bodyA` and `bodyB` are provided.

### beginShapeContactEvent
Fires when two shapes begin to contact. Properties `bodyA`, `bodyB`, `shapeA`, and `shapeB` are provided.

### endContactEvent
Fires when two rigidbodies end contact. Properties `bodyA` and `bodyB` are provided.

### endShapeContactEvent
Fires when two shapes end contact. Properties `bodyA`, `bodyB`, `shapeA`, and `shapeB` are provided.

## postStep
Fires after the physics step.

## preStep
Fires before the physics step.

## removeBody
Fires when a rigidbody is removed from the world. Property `body` is provided.

## Properties

See the base [World](https://pmndrs.github.io/cannon-es/docs/classes/world.html) class for common properties.

### .<a>epsilon</a> : <span class="param">Float</span>
The difference between one and the smallest value greater than one that can be represented as a Number. Used for keeping [Body](https://pmndrs.github.io/cannon-es/docs/classes/body.html) and [Entity](api/core/Entity) in sync. Default is **0.001**.

### .<a>gravity</a> : <span class="param">[Vector3](https://threejs.org/docs/#api/en/math/Vector3)</span>
The gravity applied to all rigidbodies in the scene. Default is **(0, - 9.80665, 0)**.

### .<a>rigidbodies</a> : <span class="param">Array</span>
Array with all Rigidbody components.

## Methods

See the base [World](https://pmndrs.github.io/cannon-es/docs/classes/world.html) class for common properties.

## Source
[src/core/Physics.js](https://github.com/Cloud9c/taro/blob/master/src/core/Physics.js)