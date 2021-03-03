# [Taro](https://www.echou.xyz/taro/) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Cloud9c/taro/blob/master/LICENSE)

A lightweight 3D game engine for the web. Built with [three.js](https://github.com/mrdoob/three.js/) and [cannon-es](https://github.com/pmndrs/cannon-es).

[Editor](https://www.echou.xyz/taro/editor/) &mdash;
[Documentation](https://www.echou.xyz/taro/docs/#/) &mdash;
[Examples](https://www.echou.xyz/taro/examples/)

## Usage

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
