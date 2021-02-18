# Libraries

## Three.js

taro.js is an extension of [three.js](https://threejs.org/), a lightweight 3D rendering library that abstracts away many of the details of WebGL. All of the core functions and classes in three.js are automatically a part of Taro (except for Scene, which is overridden):

```javascript

// in three.js
var object = new THREE.Object3D();

// in taro.js
var object = new TARO.Object3D();


```

A basic introduction of three.js can go a long way, especially if you decide to create your own meshes and sprites. Check out [their documentation](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) to learn more.

## Cannon-es

taro.js integrates [cannon-es](https://pmndrs.github.io/cannon-es/) for physics-related components (Rigidbody, Shape, Constraint). Unlike three.js, their API is not exposed in Taro. However, being well-versed in [their documentation](https://raw.githack.com/pmndrs/cannon-es/typedoc2/docs/index.html) is still neccessary to manipulate physics components.

```javascript

var entity = new TARO.Entity();
var rigidbody = entity.addComponent('rigidbody');

// physics components are simply wrappers for their cannon-es counterpart, stored in .ref
var cannonBody = rigidbody.ref;

// applyForce is a cannon-es function
cannonBody.applyForce(new TARO.Vector3(0, 100, 100))


```

Note that the position, rotation, and scale of cannon-es objects are automatically kept in sync by Taro!