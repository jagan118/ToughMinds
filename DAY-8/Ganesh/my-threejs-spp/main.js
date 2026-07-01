// import * as THREE from 'three'; //
// // import { fill } from 'three/src/extras/TextureUtils.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// // 1. Create the Scene (the 3D world space)
// const scene = new THREE.Scene(); //
// const loader = new GLTFLoader();

// // 2. Create the Camera (Field of View, Aspect Ratio, Near plane, Far plane)
// const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000); //
// camera.position.z = 5; // Move camera back to view the object

// // 3. Create a 3D Mesh (Geometry + Material)
// const tankGeometry = new THREE.CylinderGeometry(1, 2, 3, 32); // Box dimensions
// const tankMaterial = new THREE.MeshStandardMaterial({ color: 0xADD8E6, metalness: 0.7, roughness: 0.6 }); // white color
// const tank = new THREE.Mesh(tankGeometry, tankMaterial); // Combine into a mesh
// // scene.add(tank); // Add cube to our scene

// //creating a 3d floor
// const floorGeometry = new THREE.PlaneGeometry(20, 20);
// const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = -Math.PI / 2;
// floor.position.y = -1.5;
// // scene.add(floor)

// //creating a pipe
// const pipeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 32);
// const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.4 }); // white color
// const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial); // Combine into a mesh
// pipe.rotation.z = Math.PI / 2;
// pipe.position.x = 2;
// pipe.position.y = -1;

// //Creating a valve
// const valveGeometry = new THREE.BoxGeometry(1, 1, 1);
// const valveMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.4 }); // white color
// const valve = new THREE.Mesh(valveGeometry, valveMaterial);
// valve.position.x = 4;
// valve.position.y = -1;

// //Creating a tank group
// const tankGroup = new THREE.Group();
// tankGroup.add(tank);
// tankGroup.add(floor);
// tankGroup.add(pipe);
// tankGroup.add(valve);
// tankGroup.rotation.y -= 0.6;
// // scene.add(tankGroup);

// let waterTowerScene;
// loader.load('/WaterTower.glb', (gltf) => {
//     waterTowerScene = gltf.scene;
//     waterTowerScene.scale.set(0.5, 0.5, 0.5)
//     waterTowerScene.position.set(-3, -3, -3)
//     scene.add(waterTowerScene);
//     waterTowerScene.traverse((child) => {
//         if (child.isMesh) {
//             console.log("Found mesh named:", child.name);
//         }
//     });
// });


// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
// scene.add(ambientLight);
// //adding light 
// const light = new THREE.DirectionalLight(0xffffff, 2);
// light.position.set(0, 4, 5)
// scene.add(light);
// // 4. Create the WebGL Renderer
// const renderer = new THREE.WebGLRenderer({ antialias: true }); //
// renderer.setSize(window.innerWidth, window.innerHeight); // Make it full screen
// document.body.appendChild(renderer.domElement); // Append canvas to DOM

// // 5. Handle Responsive Window Resizing
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // 6. Animation Loop (Runs every frame)
// function animate() {
//     requestAnimationFrame(animate); //

//     // Rotate the cube on X and Y axes
//     // tank.rotation.x += 0.01;
//     // tank.rotation.y += 0.01;
//     // cube.rotation.z += Math.PI / 2;
//     tankGroup.rotation.y += 0.01;
//     floor.rotation.z += 0.001;
//     // waterTowerScene.rotation.y += 0.01;
//     // pipe.rotation.z += 0.02;
//     // Render the scene from the camera's perspective
//     renderer.render(scene, camera); //
// }

// // Start the animation
// animate(); //
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'

// 1. SCENE SETUP & LIGHTING
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;

// Add clear lights so we can see our 3D shapes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const canvas = document.createElement('canvas');
canvas.width = 128;
canvas.height = 128;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0077ff';
ctx.fillRect(0, 0, 128, 128);
ctx.fillStyle = '#33a3ff';
ctx.fillRect(0, 40, 128, 48);

const waterTexture = new THREE.CanvasTexture(canvas);
waterTexture.wrapS = THREE.RepeatWrapping; // Allows horizontal looping
waterTexture.wrapT = THREE.RepeatWrapping; // Allows vertical looping
waterTexture.repeat.set(4, 1);             // Tweak how squished the waves look


const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.3,
    wireframe: false
});

const waterFlowMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0,
    wireframe: false
});

const waterMaterial = new THREE.MeshStandardMaterial({
    map: waterTexture,
    roughness: 0.1
});

const tankGeo = new THREE.BoxGeometry(2, 3, 2); // Width, Height, Depth
const tank1 = new THREE.Mesh(tankGeo, glassMaterial);
tank1.position.set(-4, 0, 0); // Move 4 units to the LEFT (Negative X)
scene.add(tank1);

// Water inside Tank 1 (Child of Tank 1)
const water1Geo = new THREE.BoxGeometry(1.9, 2.8, 1.9); // Slightly smaller than tank
const waterInTank1 = new THREE.Mesh(water1Geo, waterMaterial);
waterInTank1.position.set(0, 0, 0); // Center inside parent tank
tank1.add(waterInTank1);

// --- TANK 2 (Destination Tank on the Right) ---
const tank2 = new THREE.Mesh(tankGeo, glassMaterial);
tank2.position.set(4, 0, 0); // Move 4 units to the RIGHT (Positive X)
scene.add(tank2);

// Water inside Tank 2 (Starts completely flat/empty)
const waterInTank2 = new THREE.Mesh(water1Geo, waterMaterial);
waterInTank2.position.set(0, -1.4, 0); // Move down to bottom of tank
waterInTank2.scale.set(1, 0.01, 1);    // Scale height to almost 0 (Empty)
tank2.add(waterInTank2);


const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
const pipe = new THREE.Mesh(pipeGeo, waterMaterial);

pipe.rotation.z = Math.PI / 2;
pipe.position.set(0, -1, 0);
scene.add(pipe);


const valveGroup = new THREE.Group();

const valveMaterial = new THREE.MeshStandardMaterial({
    color: 0xcc0000,
    roughness: 0.4,
    metalness: 0.2
});

const rimGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.08, 16);
const rim = new THREE.Mesh(rimGeo, valveMaterial);
valveGroup.add(rim);

const spokeGeo = new THREE.BoxGeometry(1.0, 0.2, 0.1);
const spoke = new THREE.Mesh(spokeGeo, valveMaterial);
spoke.position.y += 0.2;
valveGroup.add(spoke);

valveGroup.position.set(0, -0.75, 0); // Sit right on top of the horizontal pipe center

valveGroup.rotation.y = Math.PI / 2;

scene.add(valveGroup);

//Click using ray casting
const mouseClick = new THREE.Vector2();
const rayCaster = new THREE.Raycaster();

//Implementing selection Outliner when hover an object

const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);

//add renderPass to composer\
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const outLinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
)
composer.addPass(outLinePass);
outLinePass.edgeStrength = 4;
outLinePass.edgeGlow = 1;
outLinePass.edgeThickness1;
outLinePass.visibleEdgeColor.set('#ffcc00')
outLinePass.hiddenEdgeColor.set('#111111');

let isSystemRunning = false;

window.addEventListener("click", (event) => {
    mouseClick.x = ((event.clientX) / innerWidth) * 2 - 1;
    mouseClick.y = -((event.clientY) / innerHeight) * 2 + 1;
    rayCaster.setFromCamera(mouseClick, camera);
    const intersects = rayCaster.intersectObjects(valveGroup.children, true)
    if (intersects.length > 0) {
        console.log("valurGroup clicked..");
        isSystemRunning = isSystemRunning ? false : true;
    }
    
})

window.addEventListener("mousemove", (event) => {
    mouseClick.x = ((event.clientX) / innerWidth) * 2 - 1;
    mouseClick.y = -((event.clientY) / innerHeight) * 2 + 1;
    rayCaster.setFromCamera(mouseClick, camera);
    const intersects = rayCaster.intersectObjects(valveGroup.children, true)
    if (intersects.length > 0) {
        // console.log("valurGroup clicked..");
        outLinePass.selectedObjects = [valveGroup];

        document.body.style.cursor = "pointer";
        // isSystemRunning = true;
    }
    else {
        outLinePass.selectedObjects = [];

        document.body.style.cursor = "default";
    }

})



let animationProgress = 0;

function animate() {
    requestAnimationFrame(animate);

    if (isSystemRunning && animationProgress < 1) {
        animationProgress += 0.005;
        valveGroup.rotation.y += 0.04;
        waterTexture.offset.x -= 0.03;


        waterInTank1.scale.y = 1 - animationProgress;
        waterInTank1.position.y = - (animationProgress * 1.4);


        waterInTank2.scale.y = animationProgress;
        waterInTank2.position.y = -1.4 + (animationProgress * 1.4);

        if (animationProgress >= 0.5) {
            animationProgress = 1;
        }
    }
    controls.update();

    // renderer.render(scene, camera);
    composer.render();
}


animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
