# Getting started

Taro is an Entity Component System (ECS) engine for web applications. The basic idea of this pattern is to move from defining application entities using a class hierarchy to using composition in a Data Oriented Programming paradigm. ([More info on wikipedia](https://en.wikipedia.org/wiki/Entity_component_system)). Programming with an ECS can result in code that is more efficient and easier to extend over time. Some common terms within Taro are:

- [entities](/api/core/Entity): an object with a unique ID that can have multiple components attached to it.
- [components](/api/core/Component): different facets of an entity. ex: geometry, rigidbody, hit points.
- [scenes](/api/core/Scene): a collection of entities and their components.
- [apps](/api/core/App): the root container for scenes and other core classes.

The usual workflow when building a taro.js program:
- Create the `components` that shape the data and functions you need to use in your application.
- Create `entities` and attach `components` to them.

## Before we start
Before you can use taro.js, you need somewhere to display it. Save the following HTML to a file on your computer, along with a copy of taro.js in the js/ directory, and open it in your browser:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My first taro.js app</title>
    <style>
      body { margin: 0; }
    </style>
  </head>
  <body>
    <script src="js/taro.js"></script>
    <script>
      // Our Javascript will go here.
    </script>
  </body>
</html>
```

## Creating an app
Let's start creating our first app and add the element to our HTML document:
```javascript
var app = new TARO.App();
document.body.appendChild( app.domElement );
```

## Creating a scene
Scenes contain a set of entities:
```javascript
var scene = new TARO.Scene();
app.setScene(scene);
```

## Creating components
Components are objects that hold data and functions. We can use any way to define them, for example using ES6 class syntax (recommended):
```javascript
class CubeController {
  init() {
    // fires when the component is attached to an entity
    this.rotation = this.entity.rotation;
  }

  update() {
    // fires once per frame
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
  }
}

```

Then we need to register components to use them.

```javascript
TARO.registerComponent('cubeController', CubeController);
```

[More info on how to create components](/api/core/Component).

## Creating entities
Having our world and some components already defined, let's create [entities](/api/core/Entity) and attach these components to them:
```javascript
var cube = new TARO.Entity('cube');
cube.addComponent('material', { color: 0x00ff00 });
cube.addComponent('geometry', { type: 'box' });
cube.addComponent('cubeController');

var camera = new TARO.Entity('camera');
camera.position.z = 5;
camera.addComponent('camera');
```

With that, we have just created 2 entities: one with the `Material`, `Geometry` and `CubeController` components, and another with just the `Camera` component.
Notice that the `Geometry` and `Material` components are added with parameter objects. If we didn't use the parameters then the
components would use the default values declared in their schemas.

## Start!
Now you just need to invoke `app.start()`, and the app will begin automatically updating every frame:
```javascript
app.start();
```

## Putting everything together
Congratulations! You have now completed your first taro.js application. It's simple, you have to start somewhere.

The full code is available below and as an editable [live example](https://jsfiddle.net/0jvyadmx/). Play around with it to get a better understanding of how it works.
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My first taro.js app</title>
    <style>
      body { margin: 0; }
    </style>
  </head>
  <body>
    <script src="js/taro.js"></script>
    <script>
      var app = new TARO.App();
      document.body.appendChild( app.domElement );

      var scene = new TARO.Scene();
      app.setScene(scene);

      class CubeController {
        init() {
          // fires when the component is attached to an entity
          this.rotation = this.entity.rotation;
        }

        update() {
          // fires once per frame
          this.rotation.x += 0.01;
          this.rotation.y += 0.01;
        }
      }

      TARO.registerComponent('cubeController', CubeController);

      var cube = new TARO.Entity('cube');
      cube.addComponent('material', { color: 0x00ff00 });
      cube.addComponent('geometry', { type: 'box' });
      cube.addComponent('cubeController');

      var camera = new TARO.Entity('camera');
      camera.position.z = 5;
      camera.addComponent('camera');

      app.start();
      // beep boop hey look it works
    </script>
  </body>
</html>
```