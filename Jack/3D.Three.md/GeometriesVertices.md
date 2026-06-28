# Basic 2D Planes
## PlaneGeometry(width,height): A flat, 2D grid rectangle.
// Parameters: width, height, widthSegments, heightSegments
const geometry = new THREE.PlaneGeometry(5, 5, 1, 1);

## CircleGeometry(radius, segments) A flat, pie-slice-segmented circle.
(3,32) = 3 radius size for circle,32 segments to form a circle 

Vertices required: Minimum 4 vertices (creates a triangle). A smooth circle typically uses 32 segments, generating 34 vertices (1 center point + 32 outer points + 1 duplicate to close the loop).
// Parameters: radius, segments
const geometry = new THREE.CircleGeometry(3, 32);

## RingGeometry(innerRadius, outerRadius, thetaSegments) A flat ring/disk with a hole in the center. (1,3,32)
Vertices required: Dependent on theta segments. A standard 32-segment ring uses 66 vertices (one inner ring point and one outer ring point per segment, plus duplicates to close).
// Parameters: innerRadius, outerRadius, thetaSegments
const geometry = new THREE.RingGeometry(1, 3, 32);

#  Standard 3D Primitives
## BoxGeometry(width, height, depth)  A 3D box, cube, or oblong brick
Vertices required: Minimum 24 vertices (6 faces X 4 vertices per face, separated so lighting and textures look correct on each sharp face).
// Parameters: width, height, depth
const geometry = new THREE.BoxGeometry(2, 2, 2);

## SphereGeometry(radius, widthSegments, heightSegments)  :A 3D ball/globe.

What it forms: A 3D ball/globe.

Vertices required: Depends entirely on resolution. A low-poly sphere might use 8 horizontal and 6 vertical segments (~30 vertices), while a smooth sphere with 32×16 segments creates around 561 vertices.

Example:

JavaScript
// Parameters: radius, widthSegments, heightSegments
const geometry = new THREE.SphereGeometry(2, 32, 16); 

## CylinderGeometry
What it forms: A tube or column with flat circular caps.
Vertices required: A typical 32-segment cylinder requires roughly 130+ vertices to handle the top cap, bottom cap, and smooth sides cleanly.
Example:
JavaScript
// Parameters: radiusTop, radiusBottom, height, radialSegments
const geometry = new THREE.CylinderGeometry(1, 1, 4, 32); 

## ConeGeometry
What it forms: A classic ice-cream cone shape pointing up to a single top tip.
Vertices required: Similar to a cylinder, but the top radius is locked at 0. A 32-segment cone uses about 66 vertices.
Example:
JavaScript
// Parameters: radius, height, radialSegments
const geometry = new THREE.ConeGeometry(2, 4, 32); 

## TorusGeometry
What it forms: A 3D donut or inner tube.
Vertices required: Formed by spinning a small circle around a large loop. With 24×12 segments, it generates around 325 vertices.
Example:
JavaScript
// Parameters: radius, tubeThickness, radialSegments, tubularSegments
const geometry = new THREE.TorusGeometry(3, 1, 12, 24); 

## TorusKnotGeometry
What it forms: A complex, self-weaving 3D pretzel knot.
Vertices required: Highly complex! Even a basic setup requires hundreds of vertices (e.g., 64×8 segments generates over 500 vertices).
Example:
JavaScript
// Parameters: radius, tube, tubularSegments, radialSegments
const geometry = new THREE.TorusKnotGeometry(2, 0.6, 64, 8); 

## CapsuleGeometry
What it forms: A 3D pill or medicine capsule shape.
Vertices required: A cylinder body merged with two hemisphere caps. Usually generates 200+ vertices depending on the cap segments.
Example:
JavaScript
// Parameters: radius, length, capSegments, radialSegments
const geometry = new THREE.CapsuleGeometry(1, 2, 4, 16); 

# 3. Polyhedrons (Flat-Faceted Geometries)
## TetrahedronGeometry
What it forms: A pyramid with a triangular base (4 faces total).
Vertices required: Exactly 12 vertices (4 sharp corners, each duplicated 3 times so the edges look perfectly sharp under lighting).
Example:
JavaScript
// Parameters: radius, detail (0 means raw polyhedron, higher means subdivided sphere)
const geometry = new THREE.TetrahedronGeometry(2, 0); 

## OctahedronGeometry
What it forms: An 8-sided diamond shape (two square-based pyramids glued together).
Vertices required: Exactly 24 vertices (6 corners × 4 face connections).
Example:
JavaScript
const geometry = new THREE.OctahedronGeometry(2, 0); 

## DodecahedronGeometry
What it forms: A 12-sided geometric dice where every face is a pentagon.
Vertices required: Exactly 60 vertices (20 corners × 3 face connections).
Example:
JavaScript
const geometry = new THREE.DodecahedronGeometry(2, 0); 

## IcosahedronGeometry
What it forms: A 20-sided structure made entirely of triangles (looks like a 20-sided D&D gaming die).
Vertices required: Exactly 60 vertices.
Example:
JavaScript
const geometry = new THREE.IcosahedronGeometry(2, 0); 

## PolyhedronGeometry
What it forms: Whatever custom faceted polygon shape you define manually.
Vertices required: You supply an array of exact coordinates.
Example:
JavaScript
const verticesOfCube = [
  -1,-1,-1,  1,-1,-1,  1, 1,-1,  -1, 1,-1,
  -1,-1, 1,  1,-1, 1,  1, 1, 1,  -1, 1, 1
];
const indicesOfFaces = [
  2,1,0,  0,3,2,  0,4,7,  7,3,0,  0,1,5,  5,4,0,
  1,2,6,  6,5,1,  2,3,7,  7,6,2,  4,5,6,  6,7,4
];
// Parameters: verticesArray, indicesArray, radius, detail
const geometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 2, 0);

# 4. Generated / Advanced Geometries
## ExtrudeGeometry
What it forms: Adds 3D depth/thickness to any flat 2D custom drawing.
Vertices required: Varies wildly based on how complex your 2D shape is.
Example:
JavaScript
const shape = new THREE.Shape();
shape.moveTo(0,0); shape.lineTo(0,2); shape.lineTo(2,2); // Makes a triangle
const settings = { depth: 1, bevelEnabled: false };
const geometry = new THREE.ExtrudeGeometry(shape, settings);

## LatheGeometry
What it forms: Symmetric items like a vase, glass, or doorknob by spinning a 2D line around the center axis.
Vertices required: Points along your line multiplied by the number of spin segments (e.g., 10 profile points × 20 segments = ~200 vertices).
Example:
JavaScript
const points = [];
for ( let i = 0; i < 10; i++ ) {
	points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 2 + 1, ( i - 5 ) * 2 ) );
}
// Parameters: pointsPath, segments
const geometry = new THREE.LatheGeometry(points, 20);

## TubeGeometry
What it forms: A 3D pipe, cable, or hose wrapping along a windy path curve.
Vertices required: Path steps multiplied by radial segments.
Example:
JavaScript
const curve = new THREE.CatmullRomCurve3([
	new THREE.Vector3(-5, 0, 0),
	new THREE.Vector3(0, 5, 0),
	new THREE.Vector3(5, 0, 0)
]);
// Parameters: pathCurve, tubularSegments, radius, radialSegments, closed
const geometry = new THREE.TubeGeometry(curve, 20, 1, 8, false);

## ShapeGeometry
What it forms: A perfectly flat 2D filled polygon based on a path outline.
Vertices required: Matches the number of coordinate points in your custom path.
Example:
JavaScript
const shape = new THREE.Shape();
shape.moveTo(0, 0); shape.lineTo(0, 3); shape.lineTo(3, 0);
const geometry = new THREE.ShapeGeometry(shape);
# 5. Text & Specialized Geometries
## TextGeometry
What it forms: Fully solid 3D typography/words.
Vertices required: Thousands! Letters have incredibly complex curves, meaning even single words generate massive vertex loads.
Example:
JavaScript
// Requires importing FontLoader and TextGeometry separately from addons
const geometry = new THREE.TextGeometry('Hello!', {
	font: loadedFont, size: 2, depth: 0.5
});

## EdgesGeometry
What it forms: An outline framework. It filters out structural triangle layout splits from a shape, leaving only the clean outer border design.
Vertices required: Generates simple linear line vertex data based on your target geometry.
Example:
JavaScript
const box = new THREE.BoxGeometry(2, 2, 2);
const geometry = new THREE.EdgesGeometry(box); // Forms wireframe outline boundaries

## WireframeGeometry
What it forms: A full skeleton map showing exactly every single hidden triangle connecting the shape's mesh together.
Vertices required: Twice the line-segment count of the underlying mesh.
Example:
JavaScript
const sphere = new THREE.SphereGeometry(2, 16, 16);
const geometry = new THREE.WireframeGeometry(sphere);