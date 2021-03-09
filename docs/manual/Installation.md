# Installation
You can install taro.js with just static hosting or a CDN.

Whichever you choose, be consistent and import all files from the same version of the library. Mixing files from different sources may cause duplicate code to be included, or even break the application in unexpected ways.

All methods of installing taro.js depend on ES modules (see [Eloquent JavaScript: ECMAScript Modules](https://eloquentjavascript.net/10_modules.html#h_hF2FmOVxw7)), which allow you to include only the parts of the library needed in the final project.

## Install from CDN or static hosting
The taro.js library can be used without any build system, either by uploading files to your own web server or by using an existing CDN. Because the library relies on ES modules, any script that references it must use type="module" as shown below:

```html
<script type="module">

  // Ex 1: Import the entire taro.js core library from a CDN
  import * as TARO from 'https://www.echou.xyz/taro.js/build/taro.module.js';
  var app = new App();

  // Ex 2: Import just the parts you need from static hosting
  import { App } from 'js/taro.module.js';
  var app = new App();

</script>
```