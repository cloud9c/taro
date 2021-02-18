# Getting started

## Taro basics
- [entities](../api/core/Entity): an object with a unique ID that can have multiple components attached to it.
- [components](../api/core/ComponentManager): different facets of an entity. ex: geometry, physics, hit points.
- [app](../api/core/App): a container for entities, components, and other core classes.

The usual workflow when building a Taro program:
- Create the `components` that shape the data and functions you need to use in your application.
- Create `entities` and attach `components` to them.

## Creating an app
Let's start creating our first app:
```javascript
app = new TARO.App();
```

## Creating a scene
Scenes contain a set of entities:
```javascript
app = new TARO.App();
```

## Creating components
Components are objects that hold data and functions. We can use any way to define them, for example using ES6 class syntax (recommended):
```javascript
class CubeController {

  update() {
    this.entity.rotation.x += 0.01;
    this.entity.rotation.y += 0.01;
  }

}

```

Then we need to register components to use them.

```javascript
  TARO
    .ComponentManager
    .register(Rotater);
```

[More info on how to create components](Creating-components?id=components).

## Creating entities
Having our world and some components already defined, let's create [entities](/manual/Architecture?id=entities) and attach these components to them:
```javascript
var entityA = world
  .createEntity()
  .addComponent(Position);

for (let i = 0; i < 10; i++) {
  world
    .createEntity()
    .addComponent(Acceleration)
    .addComponent(Position, { x: Math.random() * 10, y: Math.random() * 10, z: 0});
}
```

With that, we have just created 11 entities. 10 with the `Acceleration` and `Position` components, and one with just the `Position` component.
Notice that the `Position` component is added using custom parameters. If we didn't use the parameters then the
component would use the default values declared in the `Position` class.

## Creating a system
Now we are going to define a [system](/manual/Architecture?id=systems) to process the components we just created.
A system should extend the `System` interface and can implement the following methods:
- `init`: This will get called when the system is registered in a world.
- `execute(delta, time)`: This is called on every frame.

We could also define the [queries](/manual/Architecture?id=queries) of entities we are interested in based on the components they own. The `queries` attribute should be a static attribute of your system.

We will start by creating a system that will loop through all the entities that have a `Position` component (11 in our example) and log their positions.

```javascript
class PositionLogSystem extends System {
  init() { /* Do whatever you need here */ }

  // This method will get called on every frame
  execute(delta, time) {
    // Iterate through all the entities on the query
    this.queries.position.results.forEach(entity => {
      // Access the component `Position` on the current entity
      let pos = entity.getComponent(Position);

      console.log(`Entity with ID: ${entity.id} has component Position={x: ${pos.x}, y: ${pos.y}, z: ${pos.z}}`);
    });
  }
}

// Define a query of entities that have the "Position" component
PositionLogSystem.queries = {
  position: {
    components: [Position]
  }
}
```

The next system moves each entity that has both a Position and an Acceleration.

```javascript
class MovableSystem extends System {
  init() { /* Do whatever you need here */ }

  // This method will get called on every frame by default
  execute(delta, time) {

    // Iterate through all the entities on the query
    this.queries.moving.results.forEach(entity => {

      // Get the `Acceleration` component as Read-only
      let acceleration = entity.getComponent(Acceleration).value;

      // Get the `Position` component as Writable
      let position = entity.getMutableComponent(Position);
      position.x += acceleration * delta;
      position.y += acceleration * delta;
      position.z += acceleration * delta;
    });
  }
}
```

Please note that we are accessing components on an entity by calling:
- `getComponent(Component)`: If the component will be used as read-only.
- `getMutableComponent(Component)`: If we plan to modify the values on the component.

```javascript
// Define a query of entities that have "Acceleration" and "Position" components
MovableSystem.queries = {
  moving: {
    components: [Acceleration, Position]
  }
}
```

This system's query `moving` holds a list of entities that have both `Acceleration` and `Position`; 10 in total in our example.

Please notice that we could create an arbitrary number of queries if needed and process them in `execute`, ex:
```javascript
class SystemDemo extends System {
  execute() {
    this.queries.boxes.results.forEach(entity => { /* do things */});
    this.queries.balls.results.forEach(entity => { /* do things */});
  }
}

SystemDemo.queries = {
  boxes: { components: [Box] },
  balls: { components: [Ball] },
};
```

Now let's register them in the world so they get initialized and added to the default scheduler to execute them on each frame.

```javascript
world
  .registerSystem(MovableSystem)
  .registerSystem(PositionLogSystem);
```

For more information this please check the architecture documentation: [Accessing and modifying components](/manual/Architecture?id=accessing-components-and-modify-components) and [Reactive Queries](/manual/Architecture?id=reactive-queries)


## Start!
Now you just need to invoke `world.execute(delta, time)` per frame. Currently ECSY doesn't provide a default scheduler, so you must do it yourself. eg:
```javascript
let  lastTime = performance.now();
function  run() {
  // Compute delta and elapsed time
  let time = performance.now();
  let delta = time - lastTime;

  // Run all the systems
  world.execute(delta, time);

  lastTime = time;
  requestAnimationFrame(run);
}

run();
```

## Putting everything together
```javascript
import { World, System } from 'ecsy';

let world = new World();

class Acceleration extends Component {}

Acceleration.schema = {
  value: { type: Types.Number, default: 0.1 }
};

class Position extends Component {}

Position.schema = {
  x: { type: Types.Number },
  y: { type: Types.Number },
  z: { type: Types.Number }
};

world
  .registerComponent(Acceleration)
  .registerComponent(Position);

class PositionLogSystem extends System {
  init() {}
  execute(delta, time) {
    this.queries.position.results.forEach(entity => {
      let pos = entity.getComponent(Position);
      console.log(`Entity with ID: ${entity.id} has component Position={x: ${pos.x}, y: ${pos.y}, z: ${pos.z}}`);
    });
  }
}

PositionLogSystem.queries = {
  position: {
    components: [Position]
  }
}

class MovableSystem extends System {
  init() {}
  execute(delta, time) {
    this.queries.moving.results.forEach(entity => {
      let acceleration = entity.getComponent(Acceleration).value;
      let position = entity.getMutableComponent(Position);
      position.x += acceleration * delta;
      position.y += acceleration * delta;
      position.z += acceleration * delta;
    });
  }
}

MovableSystem.queries = {
  moving: {
    components: [Acceleration, Position]
  }
}

world
  .registerSystem(MovableSystem)
  .registerSystem(PositionLogSystem)

world
  .createEntity()
  .addComponent(Position);

for (let i = 0; i < 10; i++) {
  world
    .createEntity()
    .addComponent(Acceleration)
    .addComponent(Position, { x: Math.random() * 10, y: Math.random() * 10, z: 0});
}

let lastTime = performance.now();
function run() {
  let time = performance.now();
  let delta = time - lastTime;

  world.execute(delta, time);

  lastTime = time;
  requestAnimationFrame(run);
}

run();
```

## What's next?
This was a quick overview on how things are structured using ECSY, but we encourage you to [read the architecture documentation](/manual/Architecture) for more detailed information.
