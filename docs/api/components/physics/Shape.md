[Component](api/core/Component) ›

# Shape
Defines the shape of a rigidbody. Used for collision detection and response.

Note that **planes** extends infinitely in 3d space. Use a **box** shape in order to create a limited floor/ground.

## Code Example

```javascript
var entity = new Entity();
entity.addComponent('rigidbody');
entity.addComponent('shape');
```

## Events

### error
Fires when an asset failed to load. Property `event` is provided (XMLHttpRequest error event).

### load
Fires when an asset failed to load. Property `material` is provided (loaded material).

### progress
Fires when an asset is loaded. Property `event` is provided (XMLHttpRequest progress event).


## Data Parameters

| Property             | Description                                                          | Default Value |
|----------------------|----------------------------------------------------------------------|---------------|
| collisionFilterGroup | The collision group the shape belongs to.                            | 1             |
| collisionFilterMask  | The collision group the shape can collide with.                      | -1            |
| collisionResponse    | Whether to produce contact forces when in contact with other shapes. | true          |
| type                 | Dynamic, kinematic, or static.                                       | "dynamic"     |
| material             | URL or path to a contact material                                    | ""            |
| offset               | Local position offset from the body                                  | [0, 0, 0]     |
| orientation          | Local rotation offset from the body in Euler angles                  | [0, 0, 0]     |

### box

| Property    | Description                                 | Default Value     |
|-------------|---------------------------------------------|-------------------|
| halfExtents | Half the size of the box in each dimension. | [ 0.5, 0.5, 0.5 ] |

### cylinder

| Property     | Description                                                         | Default Value |
|--------------|---------------------------------------------------------------------|---------------|
| height       | Height of the cylinder.                                             | 1             |
| numSegments  | Number of segmented faces around the circumference of the cylinder. | 8             |
| radiusBottom | Radius of the cylinder at the bottom.                               | 1             |
| radiusTop    | Radius of the cylinder at the top.                                  | 1             |

### convex

| Property | Description                          | Default Value |
|----------|--------------------------------------|---------------|
| convex   | Mesh file used to map a convex hull. | ""            |

### heightfield

| Property    | Description                                                                                 | Default Value |
|-------------|---------------------------------------------------------------------------------------------|---------------|
| asset       | Grayscale image used to map elevation                                                       | ""            |
| elementSize | Distance between the data points in X and Y directions.                                     | 1             |
| maxValue    | Maximum value of the data points in the data array. Set to zero to automatically calculate. | 0             |
| minValue    | Minimum value of the data points in the data array. Set to zero to automatically calculate. | 0             |

### plane

No additional parameters.

### particle

No additional parameters.

### sphere

| Property | Description               | Default Value |
|----------|---------------------------|---------------|
| radius   | The radius of the sphere. | 1             |

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>ref</a> : <span class="param">[Constraint](https://pmndrs.github.io/cannon-es/docs/classes/constraint.html)</span>
Reference to the cannon-es [Constraint](https://pmndrs.github.io/cannon-es/docs/classes/constraint.html) classes.

### .<a>type</a> : <span class="param">String</span>
The shape type as determined by the data parameters. Modifying this property does not change the shape type.

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/components/physics/Shape.js](https://github.com/Cloud9c/taro/blob/master/src/components/physics/Shape.js)