# Loading 3D models
3D models are available in hundreds of file formats, each with different purposes, assorted features, and varying complexity.

If you're new to running a local server, begin with how to run things locally first. Many common errors viewing 3D models can be avoided by hosting files correctly.

## Loading

We recommend using glTF (GL Transmission Format). Both .GLB and .GLTF versions of the format are well supported. Because glTF is focused on runtime asset delivery, it is compact to transmit and fast to load. Features include meshes, materials, textures, skins, skeletons, morph targets, animations, lights, and cameras. 

Public-domain glTF files are available on sites like Sketchfab, or various tools include glTF export:

- [Blender](https://www.blender.org/) by the Blender Foundation
- [Substance](https://www.substance3d.com/products/substance-painter) Painter by Allegorithmic
- [Modo](https://www.foundry.com/products/modo) by Foundry
- [Toolbag](https://marmoset.co/toolbag/) by Marmoset
- [Houdini](https://www.sidefx.com/products/houdini/) by SideFX
- [Cinema 4D](https://labs.maxon.net/?p=3360) by MAXON
- [COLLADA2GLTF](https://github.com/KhronosGroup/COLLADA2GLTF) by the Khronos Group
- [FBX2GLTF](https://github.com/facebookincubator/FBX2glTF) by Facebook
- [OBJ2GLTF](https://github.com/CesiumGS/obj2gltf) by Analytical Graphics Inc
- …and [many more](http://github.khronos.org/glTF-Project-Explorer/)

Only three loaders (ObjectLoader, DracoLoader, GLTFLoader) are included by default with taro.js — others should be added to your app individually as custom components.

See [Model component](api/components/Model.md) for further details.

## Troubleshooting
You've spent hours modeling an artisanal masterpiece, you load it into the webpage, and — oh no! 😭 It's distorted, miscolored, or missing entirely. Start with these troubleshooting steps:

1. View the model in another application. For glTF, drag-and-drop viewers are available for [three.js](https://gltf-viewer.donmccurdy.com/) and [babylon.js](https://sandbox.babylonjs.com/).
2. Try scaling the model up or down by a factor of 1000. Many models are scaled differently, and large models may not appear if the camera is inside the model.
3. Try to add and position a light component. The model may be hidden in the dark.
4. Look for failed texture requests in the network tab, like C:\\Path\To\Model\texture.jpg. Use paths relative to your model instead, such as images/texture.jpg — this may require editing the model file in a text editor.