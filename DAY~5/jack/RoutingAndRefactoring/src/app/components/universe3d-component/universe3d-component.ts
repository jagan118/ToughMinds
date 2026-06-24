import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-universe-3d',
  standalone:true,
  imports:[FormsModule],
  template: `
    <div style="position: relative; width: 100vw; height: 100vh;">
      <div style="position: absolute; top: 20px; left: 20px; background: rgba(255,255,255,0.8); padding: 15px; border-radius: 8px; z-index: 10;">
        <h3>3D Control Panel</h3>
        <label>Cube Color: </label>
        <input type="color" [(ngModel)]="cubeColor" (ngModelChange)="updateCubeProperty()">
      </div>

      <div #canvasContainer style="width: 100%; height: 100%;"></div>
    </div>
  `
})
export class Universe3dComponent implements OnInit {
  // Grab a reference to the HTML element where the 3D scene will live
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  // TypeScript Properties holding state
  cubeColor: string = '#4caf50'; 
  
  // Three.js Core Objects (The Trifecta)
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;

  ngOnInit() {
    this.init3DScene();
    this.animate();
  }

  private init3DScene() {
    const container = this.canvasContainer.nativeElement;

    // 1. Create the Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#111111'); // Dark universe

    // 2. Create the Camera (Field of View, Aspect Ratio, Near plane, Far plane)
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.z = 5; // Move camera back so we can see the center

    // 3. Create the Renderer and attach it to the Angular UI DOM
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // 4. Create a 3D Mesh (Geometry/Shape + Material/Surface)
    const geometry = new THREE.BoxGeometry(2, 2, 2); // A cube shape
    const material = new THREE.MeshBasicMaterial({ color: this.cubeColor });
    this.cube = new THREE.Mesh(geometry, material);
    
    this.scene.add(this.cube); // Drop the cube into our universe
  }

  // Angular Event: If user updates color input, change 3D mesh material properties
  updateCubeProperty() {
    if (this.cube) {
      (this.cube.material as THREE.MeshBasicMaterial).color.set(this.cubeColor);
    }
  }

  // The Animation Loop: This runs up to 60 times a second to redraw the 3D frame
  private animate = () => {
    requestAnimationFrame(this.animate);

    // Add a continuous spin to the cube
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    // Redraw the universe from the camera's perspective
    this.renderer.render(this.scene, this.camera);
  }

  // Handle browser window resize dynamically
  @HostListener('window:resize')
  onWindowResize() {
    const container = this.canvasContainer.nativeElement;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }
}