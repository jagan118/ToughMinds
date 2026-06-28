In Three.js, built-in geometries are standard 3D shapes that come pre-packaged with the library. They all inherit from the base `BufferGeometry` class.

Here is a complete list of the standard, built-in geometries in Three.js, categorized by their complexity:

---

## 1. Basic 2D Planes (Flat Geometries)

These geometries have no depth and are perfectly flat.

* **`PlaneGeometry`**: A simple flat rectangle or square. Ideal for floors, walls, or background banners.
* **`CircleGeometry`**: A flat circle made out of triangular segments (like a sliced pizza).
* **`RingGeometry`**: A flat disk with a hole in the center (like a washer or a 2D donut).

---

## 2. Standard 3D Primitives

These are the most common everyday 3D shapes.

* **`BoxGeometry`**: A standard 3D rectangular cuboid or cube.
* **`SphereGeometry`**: A 3D globe or ball. You can control its segment count to make it perfectly smooth or low-poly.
* **`CylinderGeometry`**: A tube with flat ends. Can be used to make cylinders, cones (by setting the top radius to 0), or pillars.
* **`ConeGeometry`**: A standard cone shape with a circular base pointing to a single vertex.
* **`TorusGeometry`**: A 3D donut or inner-tube shape.
* **`TorusKnotGeometry`**: A complex, twisted knot shape resembling a pretzel. Great for test shapes because of how light bounces off its curves.
* **`CapsuleGeometry`**: A cylinder with hemispherical caps on both ends (like a pill or medicine capsule).

---

## 3. Polyhedrons (Flat-Faceted Geometries)

These are mathematical shapes constructed out of flat polygons.

* **`TetrahedronGeometry`**: A 4-sided polyhedron (a pyramid with a triangular base).
* **`OctahedronGeometry`**: An 8-sided polyhedron (looks like two pyramids glued base-to-base).
* **`DodecahedronGeometry`**: A 12-sided polyhedron where each face is a pentagon.
* **`IcosahedronGeometry`**: A 20-sided polyhedron made of equilateral triangles. Often used as a base to create smooth spheres (Geo-spheres).
* **`PolyhedronGeometry`**: The base class for custom polyhedrons. You pass it a list of vertices and faces to build your own custom faceted shape.

---

## 4. Generated / Advanced Geometries

These geometries require paths, shapes, or data to be dynamically generated.

* **`ExtrudeGeometry`**: Takes a 2D path (`Shape`) and extrudes ("pushes") it forward along the Z-axis to create a 3D solid (like pushing play-doh through a template).
* **`LatheGeometry`**: Takes a 2D line (profile) and spins it around a central axis to create shapes with rotational symmetry like vases, wine glasses, or bowling pins.
* **`TubeGeometry`**: Takes a 3D spline curve line and extrudes a hollow or solid 3D tube along that path (like a hose or pipe).
* **`ShapeGeometry`**: Converts a 2D path outline into a flat, solid 2D mesh shape.

---

## 5. Text & Specialized Geometries

* **`TextGeometry`**: Generates a 3D mesh representation of text.
> *Note: This requires an external font file loaded via `FontLoader` and is imported separately from `three/addons/geometries/TextGeometry.js`.*


* **`EdgesGeometry`**: Used as a helper to display only the wireframe edges of another geometry, filtering out inner diagonal lines so it looks clean.
* **`WireframeGeometry`**: Displays the full, raw triangular wireframe structure of any given geometry.

---

### 💡 Quick Example Syntax

To use any of these, you pair them with a material and add them to your scene:

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1); // Width, Height, Depth
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

```