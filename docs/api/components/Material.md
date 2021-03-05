[Component](api/core/Component) ›

# Material
Materials describe the appearance of objects. They are defined in a (mostly) renderer-independent way, so you don't have to rewrite materials if you decide to use a different renderer. This is a wrapper class around three.js [Material](https://threejs.org/docs/#api/en/materials/Material) classes.

- **Basic** material draws geometries in a simple shaded (flat or wireframe) way.
- **Depth** material draws geometry by depth. Depth is based off of the camera near and far plane. White is nearest, black is farthest.
- **Lambert** material draws non-shiny surfaces, without specular highlights.
- **Matcap** material is defined by a MatCap (or Lit Sphere) texture, which encodes the material color and shading.
- **Normal** material maps the normal vectors to RGB colors.
- **Phong** material draws shiny surfaces with specular highlights.
- **Physical** material is an extension of the standard material, providing more advanced physically-based rendering properties.
- **Shader** material is rendered with custom shaders. Alternative to built-in materials.
- **Standard** material is a standard physically based material, using Metallic-Roughness workflow.
- **Toon** material implements toon shading.
- **Assets** are defined by the three.js [JSON Material](https://github.com/mrdoob/three.js/wiki/JSON-Material-format-4) format.

## Code Example

```javascript
var entity = new Entity();
entity.addComponent('material', {
	type: 'basic',
	color: 0x2194ce
});
```

## Events

### error
Fires when an asset failed to load. Property `event` is provided (XMLHttpRequest error event).

### load
Fires when an asset failed to load. Property `material` is provided (loaded material).

### progress
Fires when an asset is loaded. Property `event` is provided (XMLHttpRequest progress event).

## Data Parameters

| Property | Description                         | Default Value |
|----------|-------------------------------------|---------------|
| type     | 10 material types and 1 asset type. | "box"         |

All built-in materials (all types except **asset** and **shader**) have the following parameters:

| Property     | Description                                                                                                                                                | Default Value    |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| alphaTest    | Sets the alpha value to be used when running an alpha test. The material will not be renderered if the opacity is lower than this value.                   | 0                |
| blending     | Which blending to use when displaying objects with this material. See the blending mode [constants](https://threejs.org/docs/#api/en/constants/Materials). | 'NormalBlending' |
| depthTest    | Whether to have depth test enabled when rendering this material.                                                                                           | true             |
| depthWrite   | Whether rendering this material has any effect on the depth buffer.                                                                                        | true             |
| opacity      | Float in the range of 0.0 - 1.0 indicating how transparent the material is.                                                                                | 1.0              |
| side         | Defines which side of faces will be rendered - front, back or both. Other options are 'BackSide' and 'DoubleSide'.                                         | 'FrontSide'      |
| transparent  | Defines whether this material is transparent.                                                                                                              | false            |
| vertexColors | Defines whether vertex coloring is used.                                                                                                                   | false            |

### asset

| Property   | Description                                                                                                   | Default Value |
|------------|---------------------------------------------------------------------------------------------------------------|---------------|
| asset      | The path or url to a three.js [JSON Material](https://github.com/mrdoob/three.js/wiki/JSON-Material-format-4) | ""            |

### basic

| Property          | Description                                                                                                                        | Default Value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------|---------------|
| alphaMap          | The alpha map is a grayscale texture that controls the opacity across the surface (black: fully transparent; white: fully opaque). | ""            |
| aoMap             | The red channel of this texture is used as the ambient occlusion map. The aoMap requires a second set of UVs.                      | ""            |
| aoMapIntensity    | Intensity of the ambient occlusion effect. Zero is no occlusion effect.                                                            | 1             |
| color             | Color of the material.                                                                                                             | 0xffffff      |
| envMap            | The environment map.                                                                                                               | ""            |
| lightMap          | The light map. The lightMap requires a second set of UVs.                                                                          | ""            |
| lightMapIntensity | Intensity of the baked light.                                                                                                      | 1             |
| map               | The color map.                                                                                                                     | ""            |
| skinning          | Define whether the material uses skinning.                                                                                         | false         |
| specularMap       | Specular map used by the material.                                                                                                 | ""            |
| wireframe         | Render geometry as wireframe.                                                                                                      | false         |

### depth

| Property          | Description                                                                                                                                                | Default Value       |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
| alphaMap          | The alpha map is a grayscale texture that controls the opacity across the surface (black: fully transparent; white: fully opaque).                         | ""                  |
| depthPacking      | Encoding for depth packing. See [Texture constants](https://threejs.org/docs/index.html#api/en/constants/Textures)                                         | "BasicDepthPacking" |
| displacementMap   | The displacement texture is an image where the value of each pixel (white being the highest) is mapped against, and repositions, the vertices of the mesh. | ""                  |
| displacementScale | How much the displacement map affects the mesh (where black is no displacement, and white is maximum displacement).                                        | 1                   |
| map               | The color map.                                                                                                                                             | ""                  |
| skinning          | Define whether the material uses skinning.                                                                                                                 | false               |
| wireframe         | Render geometry as wireframe.                                                                                                                              | false               |

### lambert
All **basic material** properties, plus the following:

| Property          | Description                                                                                     | Default Value |
|-------------------|-------------------------------------------------------------------------------------------------|---------------|
| emissive          | Emissive (light) color of the material, essentially a solid color unaffected by other lighting. | 0x000000      |
| emissiveIntensity | Intensity of the emissive light.                                                                | 1             |
| emissiveMap       | Set emissive (glow) map.                                                                        | ""            |

### matcap

| Property          | Description                                                                                                                                                | Default Value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| alphaMap          | The alpha map is a grayscale texture that controls the opacity across the surface (black: fully transparent; white: fully opaque).                         | ""            |
| bumpMap           | The texture to create a bump map. The black and white values map to the perceived depth in relation to the lights.                                         | ""            |
| bumpScale         | How much the bump map affects the material. Typical ranges are 0-1.                                                                                        | 1             |
| color             | Color of the material.                                                                                                                                     | 0xffffff      |
| displacementMap   | The displacement texture is an image where the value of each pixel (white being the highest) is mapped against, and repositions, the vertices of the mesh. | ""            |
| displacementScale | How much the displacement map affects the mesh (where black is no displacement, and white is maximum displacement).                                        | 1             |
| flatShading       | Define whether the material is rendered with flat shading.                                                                                                 | false         |
| map               | The color map.                                                                                                                                             | ""            |
| matcap            | The matcap map.                                                                                                                                            | ""            |
| normalMap         | The texture to create a normal map. The RGB values affect the surface normal for each pixel fragment and change the way the color is lit.                  | ""            |
| normalScale       | How much the normal map affects the material. Typical ranges are 0-1.                                                                                      | [1,1]         |
| skinning          | Define whether the material uses skinning.                                                                                                                 | false         |

### normal

| Property          | Description                                                                                                                                                | Default Value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| bumpMap           | The texture to create a bump map. The black and white values map to the perceived depth in relation to the lights.                                         | ""            |
| bumpScale         | How much the bump map affects the material. Typical ranges are 0-1.                                                                                        | 1             |
| displacementMap   | The displacement texture is an image where the value of each pixel (white being the highest) is mapped against, and repositions, the vertices of the mesh. | ""            |
| displacementScale | How much the displacement map affects the mesh (where black is no displacement, and white is maximum displacement).                                        | 1             |
| flatShading       | Define whether the material is rendered with flat shading.                                                                                                 | false         |
| normalMap         | The texture to create a normal map. The RGB values affect the surface normal for each pixel fragment and change the way the color is lit.                  | ""            |
| normalScale       | How much the normal map affects the material. Typical ranges are 0-1.                                                                                      | [1,1]         |
| skinning          | Define whether the material uses skinning.                                                                                                                 | false         |
| wireframe         | Render geometry as wireframe.                                                                                                                              | false         |

### phong

| Property          | Description                                                                                                                                                | Default Value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| alphaMap          | The alpha map is a grayscale texture that controls the opacity across the surface (black: fully transparent; white: fully opaque).                         | ""            |
| aoMap             | The red channel of this texture is used as the ambient occlusion map. The aoMap requires a second set of UVs.                                              | ""            |
| aoMapIntensity    | Intensity of the ambient occlusion effect. Zero is no occlusion effect.                                                                                    | 1             |
| bumpMap           | The texture to create a bump map. The black and white values map to the perceived depth in relation to the lights.                                         | ""            |
| bumpScale         | How much the bump map affects the material. Typical ranges are 0-1.                                                                                        | 1             |
| color             | Color of the material.                                                                                                                                     | 0xffffff      |
| displacementMap   | The displacement texture is an image where the value of each pixel (white being the highest) is mapped against, and repositions, the vertices of the mesh. | ""            |
| displacementScale | How much the displacement map affects the mesh (where black is no displacement, and white is maximum displacement).                                        | 1             |
| emissive          | Emissive (light) color of the material, essentially a solid color unaffected by other lighting.                                                            | 0x000000      |
| emissiveIntensity | Intensity of the emissive light.                                                                                                                           | 1             |
| emissiveMap       | Set emissive (glow) map.                                                                                                                                   | ""            |
| envMap            | The environment map.                                                                                                                                       | ""            |
| flatShading       | Define whether the material is rendered with flat shading.                                                                                                 | false         |
| lightMap          | The light map. The lightMap requires a second set of UVs.                                                                                                  | ""            |
| lightMapIntensity | Intensity of the baked light.                                                                                                                              | 1             |
| map               | The color map.                                                                                                                                             | ""            |
| normalMap         | The texture to create a normal map. The RGB values affect the surface normal for each pixel fragment and change the way the color is lit.                  | ""            |
| normalScale       | How much the normal map affects the material. Typical ranges are 0-1.                                                                                      | [1,1]         |
| shininess         | How shiny the .specular highlight is; a higher value gives a sharper highlight.                                                                            | 30            |
| skinning          | Define whether the material uses skinning.                                                                                                                 | false         |
| specular          | Specular color of the material. This defines how shiny the material is and the color of its shine.                                                         | 0x111111      |
| specularMap       | Specular map used by the material.                                                                                                                         | ""            |
| wireframe         | Render geometry as wireframe.                                                                                                                              | false         |

### physical
All **standard material** properties, plus the following:

| Property             | Description                                                                     | Default Value |
|----------------------|---------------------------------------------------------------------------------|---------------|
| clearcoat            | Represents the thickness of the clear coat layer, from 0.0 to 1.0.              | 0.0           |
| clearcoatRoughness   | Roughness of the clear coat layer, from 0.0 to 1.0.                             | 0.0           |
| clearcoatNormalMap   | Can be used to enable independent normals for the clear coat layer.             | ""            |
| clearcoatNormalScale | How much .clearcoatNormalMap affects the clear coat layer, from [0,0] to [1,1]. | [1,1]         |

### shader
See three.js [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial) for supported parameters.

### standard

| Property          | Description                                                                                                                                                | Default Value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| alphaMap          | The alpha map is a grayscale texture that controls the opacity across the surface (black: fully transparent; white: fully opaque).                         | ""            |
| aoMap             | The red channel of this texture is used as the ambient occlusion map. The aoMap requires a second set of UVs.                                              | ""            |
| aoMapIntensity    | Intensity of the ambient occlusion effect. Zero is no occlusion effect.                                                                                    | 1             |
| bumpMap           | The texture to create a bump map. The black and white values map to the perceived depth in relation to the lights.                                         | ""            |
| bumpScale         | How much the bump map affects the material. Typical ranges are 0-1.                                                                                        | 1             |
| color             | Color of the material.                                                                                                                                     | 0xffffff      |
| displacementMap   | The displacement texture is an image where the value of each pixel (white being the highest) is mapped against, and repositions, the vertices of the mesh. | ""            |
| displacementScale | How much the displacement map affects the mesh (where black is no displacement, and white is maximum displacement).                                        | 1             |
| emissive          | Emissive (light) color of the material, essentially a solid color unaffected by other lighting.                                                            | 0x000000      |
| emissiveIntensity | Intensity of the emissive light.                                                                                                                           | 1             |
| emissiveMap       | Set emissive (glow) map.                                                                                                                                   | ""            |
| envMap            | The environment map.                                                                                                                                       | ""            |
| envMapIntensity   | Scales the effect of the environment map by multiplying its color.                                                                                         | 1.0           |
| flatShading       | Define whether the material is rendered with flat shading.                                                                                                 | false         |
| lightMap          | The light map. The lightMap requires a second set of UVs.                                                                                                  | ""            |
| lightMapIntensity | Intensity of the baked light.                                                                                                                              | 1             |
| map               | The color map.                                                                                                                                             | ""            |
| metalness         | How much the material is like a metal. Non-metallic materials such as wood or stone use 0.0, metallic use 1.0, with nothing (usually) in between.          | 0.0           |
| metalnessMap      | The blue channel of this texture is used to alter the metalness of the material.                                                                           | ""            |
| normalMap         | The texture to create a normal map. The RGB values affect the surface normal for each pixel fragment and change the way the color is lit.                  | ""            |
| normalScale       | How much the normal map affects the material. Typical ranges are 0-1.                                                                                      | [1,1]         |
| roughness         | How rough the material appears. 0.0 means a smooth mirror reflection, 1.0 means fully diffuse.                                                             | 1.0           |
| roughnessMap      | The green channel of this texture is used to alter the roughness of the material.                                                                          | ""            |
| skinning          | Define whether the material uses skinning.                                                                                                                 | false         |
| vertexTangents    | Defines whether precomputed vertex tangents, which must be provided in a vec4 "tangent" attribute, are used.                                               | false         |
| wireframe         | Render geometry as wireframe.                                                                                                                              | false         |

### toon

| Property          | Description                                                                                                                                                | Default Value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| alphaMap          | The alpha map is a grayscale texture that controls the opacity across the surface (black: fully transparent; white: fully opaque).                         | ""            |
| aoMap             | The red channel of this texture is used as the ambient occlusion map. The aoMap requires a second set of UVs.                                              | ""            |
| aoMapIntensity    | Intensity of the ambient occlusion effect. Zero is no occlusion effect.                                                                                    | 1             |
| bumpMap           | The texture to create a bump map. The black and white values map to the perceived depth in relation to the lights.                                         | ""            |
| bumpScale         | How much the bump map affects the material. Typical ranges are 0-1.                                                                                        | 1             |
| color             | Color of the material.                                                                                                                                     | 0xffffff      |
| displacementMap   | The displacement texture is an image where the value of each pixel (white being the highest) is mapped against, and repositions, the vertices of the mesh. | ""            |
| displacementScale | How much the displacement map affects the mesh (where black is no displacement, and white is maximum displacement).                                        | 1             |
| emissive          | Emissive (light) color of the material, essentially a solid color unaffected by other lighting.                                                            | 0x000000      |
| emissiveIntensity | Intensity of the emissive light.                                                                                                                           | 1             |
| emissiveMap       | Set emissive (glow) map.                                                                                                                                   | ""            |
| gradientMap       | Gradient map for toon shading. It's required to set Texture.minFilter and Texture.magFilter to TARO.NearestFilter when using this type of texture.         | ""            |
| lightMap          | The light map. The lightMap requires a second set of UVs.                                                                                                  | ""            |
| lightMapIntensity | Intensity of the baked light.                                                                                                                              | 1             |
| map               | The color map.                                                                                                                                             | ""            |
| normalMap         | The texture to create a normal map. The RGB values affect the surface normal for each pixel fragment and change the way the color is lit.                  | ""            |
| normalScale       | How much the normal map affects the material. Typical ranges are 0-1.                                                                                      | [1,1]         |
| skinning          | Define whether the material uses skinning.                                                                                                                 | false         |
| wireframe         | Render geometry as wireframe.                                                                                                                              | false         |

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>mesh</a> : <span class="param">[Mesh](https://threejs.org/docs/#api/en/objects/Mesh)</span>
Class representing triangular polygon mesh based objects. Added to an entity if both the Geometry and Material components are enabled.

### .<a>ref</a> : <span class="param">[Material](https://threejs.org/docs/#api/en/materials/Material)</span>
Reference to the three.js [Material](https://threejs.org/docs/#api/en/materials/Material) classes.

### .<a>type</a> : <span class="param">String</span>
The material type as determined by the data parameters. Modifying this property does not change the material type.

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/components/Material.js](https://github.com/Cloud9c/taro/blob/master/src/components/Material.js)