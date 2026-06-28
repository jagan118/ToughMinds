<!-- # what is three.js  -->
listen if u want to build 3d applcations on browser the browser uses the technology called WebGL to draw 3d graphics. it is hard ,writing code in it is very complex,it is low level language hard to even draw a cude,
so for that three.js provides us to build 3d applications with simple easy commands behind the scenes it take cares all the messy hard code for WebGL.

## 2. The Core Components
1. Scene [stage] : it is like a room for our all animations,3d models every thing that all stuff will inside this if we dont add this nobody can see anything
2. cameras :you need a camera to look at the scenes that stage
    * PerspectiveCamera: Works like human eyes (things far away look smaller).
    * OrthographicCamera: Works like a technical blueprint (everything stays the same size, no matter how far).
3. Geometry (The Skeleton): This is the raw shape of an object before painting it. It's just the structure—like a cardboard box or a plastic sphere.it takes x,y,z vertices to build a object
4. Materials & Textures (The Paint and Clothes): 
    * Material tells how an object reacts to light (Is it shiny like metal? Dull like wood?).
    * texture is an image wrapped around the geometry (like wrapping a brick-pattern image around a box to make it look like a real brick wall).
5. Mesh (The Final Product): In Three.js, when you combine a Geometry (shape) and a Material (skin), you get a Mesh. This is the actual item you place on the stage.
6. Lights (Stage Lighting): Without lights, your scene will be pitch black! You can add ambient light (general room light) or spotlights to cast realistic shadows.
7. Renderer (The Eyes/Screen): The renderer takes your Scene and your Camera, crunches all the 3D data, and draws it onto the flat 2D screen of your laptop or phone every single millisecond.

##  The 3D Coordinate System (The Map)
In normal web development (HTML/CSS), you only worry about 2D:  X (Left/Right) and Y (Up/Down). 3D adds a third dimension: Z (Depth/Forward/Backward).
In Three.js, by default, the center of your world is $(0, 0, 0) 
* X-axis: Moving an object positive moves it Right, negative moves it Left.
* Y-axis: Moving it positive moves it Up, negative moves it Down.
* Z-axis: Moving it positive moves it Closer to you (out of the screen), negative moves it Further away (into the screen).

## The 3 Essential Components
* The Scene: A digital black hole. It holds every object, light, and camera. If you don't use scene.add(object), that object doesn't exist in your world.

* The Camera: Your eyes. The most common is the PerspectiveCamera. It mimics a real camera lens: things that are far away automatically look smaller, giving it a realistic look.

* The Renderer: The engine. It takes the scene and the camera and calculates exactly how it should look on a flat 2D monitor, then injects it into your HTML page.

## An object it may 3d or any thing is a Mesh 

## Mesh = Geometry + Material

## Geometries (The Shape)
This is the mathematical skeleton made of points (vertices) and lines for the object .but 
 Three.js gives you built-in shapes:

BoxGeometry (Cubes, walls, bricks)
SphereGeometry (Balls, planets, globes)
CylinderGeometry (Pipes, pillars, wheels)
PlaneGeometry (Flat surfaces like floors or yards)

## Materials
Materials (The Skin)
This defines how the skeleton looks and reacts to light:

* MeshBasicMaterial: Completely ignores lights. It just shows a flat color. (Great for testing, but looks flat/2D).

* MeshStandardMaterial: Highly realistic. It reacts to lights, can have roughness, and can look metallic.


##  Lights (The Atmosphere)

Without light, a realistic material (MeshStandardMaterial) will be completely pitch black. You need to illuminate your scene:

* AmbientLight: Omnidirectional background light. It lights up every object from every angle equally. It doesn't cast shadows, it just makes sure the dark sides of your objects aren't pitch black.
* DirectionalLight: Like the Sun. The light rays travel parallel. Perfect for simulating daylight and casting long shadows.
* PointLight: Like a lightbulb or a candle. It sits at a specific coordinate $(x,y,z)$ and shoots light outwards in all directions.

## The Rendering Loop (The Heartbeat)

* In standard web apps, the page sits completely still until a user clicks a button. but 
In 3D apps, things need to look smooth, move, float, or animate constantly.

To do this, we use a specialized loop function called requestAnimationFrame.

```
function animate() {
    requestAnimationFrame(animate); // Tells the browser to run this function again instantly
    
    // Any movement logic goes here (e.g., rotating a cube slightly)
    cube.rotation.x += 0.01; 
    
    renderer.render(scene, camera); // Redraw the screen
}
animate(); // Start the loop
```
This loop runs 60 times per second


