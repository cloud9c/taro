[Component](api/core/Component) ›

# Spring
A spring connecting two bodies. This is a wrapper class around cannon-es [Spring](https://raw.githack.com/pmndrs/cannon-es/typedoc2/docs/classes/spring.html).

## Code Example

```javascript
var entityA = new Entity();
entityA.addComponent('rigidbody');

var entityB = new Entity();
entityA.addComponent('rigidbody');
entityB.addComponent('spring', {
	stiffness: 50,
	connectedBody: entityA
});
```

## Data Parameters

| Property        | Description                                                                                                                        | Default Value |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------|---------------|
| anchor          | Anchor for the body in local coordinates.                                                                                          | [0, 0, 0]     |
| connectedAnchor | Anchor for the connected body in local coordinates.                                                                                | [0, 0, 0]     |
| connectedBody   | A reference to another entity this spring connects to. If not set then the spring connects the object to [0, 0, 0] in world space. | ""            |
| damping         | Damping of the spring.                                                                                                             | 1             |
| restLength      | Rest length of the spring.                                                                                                         | 1             |
| stiffness       | Stiffness of the spring.                                                                                                           | 100           |

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>ref</a> : <span class="param">[Spring](https://raw.githack.com/pmndrs/cannon-es/typedoc2/docs/classes/spring.html)</span>
Reference to the cannon-es [Spring](https://raw.githack.com/pmndrs/cannon-es/typedoc2/docs/classes/spring.html) instance.

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/components/physics/Spring.js](https://github.com/Cloud9c/taro/blob/master/src/components/physics/Spring.js)