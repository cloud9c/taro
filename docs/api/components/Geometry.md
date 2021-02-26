[Component](api/core/Component) ›

# Geometry
A representation of mesh, line, or point geometry. Includes vertex positions, face indices, normals, colors, UVs, and custom attributes within buffers, reducing the cost of passing all this data to the GPU. This is a wrapper class around three.js's [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry) classes.

## Code Example

```javascript
var entity = new Entity();
entity.addComponent('geometry', {
	type: 'box',
	width: 2,
	height: 2,
	depth: 1
});
```

## Data Parameters

| Property | Description                                                 | Default Value |
|----------|-------------------------------------------------------------|---------------|
| type     | 13 built-in geometries and 1 asset type (see below).        | "box"         |

### asset

| Property   | Description                                                                                                   | Default Value |
|------------|---------------------------------------------------------------------------------------------------------------|---------------|
| asset      | The path or url to a three.js [JSON Geometry](https://github.com/mrdoob/three.js/wiki/JSON-Geometry-format-4) | ""            |

### box

| Property       | Description                                                          | Default Value |
|----------------|----------------------------------------------------------------------|---------------|
| width          | Width; that is, the length of the edges parallel to the X axis.      | 1             |
| height         | Height; that is, the length of the edges parallel to the Y axis.     | 1             |
| depth          | Depth; that is, the length of the edges parallel to the Z axis.      | 1             |
| widthSegments  | Number of segmented rectangular faces along the width of the sides.  | 1             |
| heightSegments | Number of segmented rectangular faces along the height of the sides. | 1             |
| depthSegments  | Number of segmented rectangular faces along the depth of the sides.  | 1             |

### circle

| Property    | Description                                                    | Default Value |
|-------------|----------------------------------------------------------------|---------------|
| radius      | Radius of the circle.                                          | 1             |
| segments    | Number of segments (triangles). Minimum is 3.                  | 8             |
| thetaStart  | Start angle for first segment.                                 | 0             |
| thetaLength | The central angle, often called theta, of the circular sector. | 2*Pi          |

### cone

| Property       | Description                                                          | Default Value |
|----------------|----------------------------------------------------------------------|---------------|
| radius         | Radius of the cone base.                                             | 1             |
| height         | Height of the cone.                                                  | 1             |
| radialSegments | Number of segmented faces around the circumference of the cone.      | 8             |
| heightSegments | Number of rows of faces along the height of the cone.                | 1             |
| openEnded      | A Boolean indicating whether the base of the cone is open or capped. | false         |
| thetaStart     | Start angle for first segment.                                       | 0             |
| thetaLength    | The central angle, often called theta, of the circular sector.       | 2*Pi          |

### cylinder

| Property       | Description                                                               | Default Value |
|----------------|---------------------------------------------------------------------------|---------------|
| radiusTop      | Radius of the cylinder at the top.                                        | 1             |
| radiusBottom   | Radius of the cylinder at the bottom.                                     | 1             |
| height         | Height of the cylinder.                                                   | 1             |
| radialSegments | Number of segmented faces around the circumference of the cylinder.       | 8             |
| heightSegments | Number of rows of faces along the height of the cylinder.                 | 1             |
| openEnded      | A Boolean indicating whether the ends of the cylinder are open or capped. | false         |
| thetaStart     | Start angle for first segment.                                            | 0             |
| thetaLength    | The central angle, often called theta, of the circular sector.            | 2*Pi          |

### dodecahedron

| Property | Description                                                                              | Default Value |
|----------|------------------------------------------------------------------------------------------|---------------|
| radius   | Radius of the dodecahedron.                                                              | 1             |
| detail   | Setting this to a value greater than 0 adds vertices making it no longer a dodecahedron. | 0             |

### icosahedron

| Property | Description                                                                                                                                       | Default Value |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| radius   | Radius of the icosahedron.                                                                                                                        | 1             |
| detail   | Setting this to a value greater than 0 adds vertices making it no longer a icosahedron. When detail is greater than 1, it's effectively a sphere. | 0             |

### octahedron

| Property | Description                                                                            | Default Value |
|----------|----------------------------------------------------------------------------------------|---------------|
| radius   | Radius of the octahedron.                                                              | 1             |
| detail   | Setting this to a value greater than 0 adds vertices making it no longer a octahedron. | 0             |

### plane

| Property       | Description                                                          | Default Value |
|----------------|----------------------------------------------------------------------|---------------|
| width          | Width along the X axis.                                              | 1             |
| height         | Height along the Y axis.                                             | 1             |
| widthSegments  | Number of segmented rectangular faces along the width of the plane.  | 1             |
| heightSegments | Number of segmented rectangular faces along the height of the plane. | 1             |

### ring

| Property      | Description                                                                          | Default Value |
|---------------|--------------------------------------------------------------------------------------|---------------|
| innerRadius   | Radius of the inner hole of the ring.                                                | 0.5           |
| outerRadius   | Radius of the outer edge of the ring.                                                | 1             |
| thetaSegments | Number of segments. A higher number means the ring will be more round. Minimum is 3. | 8             |
| phiSegments   | Number of triangles within each face.                                                | 1             |
| thetaStart    | Start angle for first segment.                                                       | 0             |
| thetaLength   | The central angle, often called theta, of the circular sector.                       | 2*Pi          |

### sphere

| Property       | Description                                          | Default Value |
|----------------|------------------------------------------------------|---------------|
| radius         | Sphere radius.                                       | 1             |
| widthSegments  | Number of horizontal segments. Minimum value is 3.   | 8             |
| heightSegments | Number of vertical segments. Minimum value is 2.     | 6             |
| phiStart       | Specify horizontal starting angle.                   | 0             |
| phiLength      | Specify horizontal sweep angle size.                 | 2*Pi          |
| thetaStart     | Specify vertical starting angle.                     | 0             |
| thetaLength    | Specify vertical sweep angle size.                   | Pi            |

### tetrahedron

| Property | Description                                                                             | Default Value |
|----------|-----------------------------------------------------------------------------------------|---------------|
| radius   | Radius of the tetrahedron.                                                              | 1             |
| detail   | Setting this to a value greater than 0 adds vertices making it no longer a tetrahedron. | 0             |

### torus

| Property        | Description                                                                                                     | Default Value |
|-----------------|-----------------------------------------------------------------------------------------------------------------|---------------|
| radius          | Radius of the torus, from the center of the torus to the center of the tube.                                    | 1             |
| tube            | Radius of the tube.                                                                                             | 0.4           |
| radialSegments  | Number of segments along the circumference of the tube ends. A higher number means the tube will be more round. | 8             |
| tubularSegments | Number of segments along the circumference of the tube face. A higher number means the tube will be more round. | 6             |
| arc             | Central angle.                                                                                                  | 2*Pi          |

### torusKnot

| Property        | Description                                                                                                     | Default Value |
|-----------------|-----------------------------------------------------------------------------------------------------------------|---------------|
| radius          | Radius of the torus, from the center of the torus to the center of the tube.                                    | 1             |
| tube            | Radius of the tube.                                                                                             | 0.4           |
| radialSegments  | Number of segments along the circumference of the tube ends. A higher number means the tube will be more round. | 8             |
| tubularSegments | Number of segments along the circumference of the tube face. A higher number means the tube will be more round. | 64            |
| p               | This value determines how many times the geometry winds around its axis of rotational symmetry.                 | 2             |
| q               | This value determines how many times the geometry winds around a circle in the interior of the torus.           | 3             |

## Properties

See the base [Component](api/core/Component) class for common properties.

### .<a>mesh</a> : <span class="param">[Mesh](https://threejs.org/docs/#api/en/objects/Mesh)</span>
Class representing triangular polygon mesh based objects. Added to an entity if both the Geometry and Material components are enabled.

### .<a>ref</a> : <span class="param">[BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry)</span>
Reference to the three.js [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry) or derived classes.

## Methods

See the base [Component](api/core/Component) class for common methods.

## Source
[src/core/Geometry.js](https://github.com/Cloud9c/taro/blob/master/src/components/Geometry.js)