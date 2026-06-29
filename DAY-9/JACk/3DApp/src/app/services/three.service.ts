import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class ThreeService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animationId: number | null = null;

  constructor() {
    // Don't initialize anything here!
  }

  // Initialize when component is ready
  init(canvas: HTMLCanvasElement) {
    // Now create Three.js objects (window exists now)
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      antialias: true 
    });

    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setClearColor(0x222222);
    this.camera.position.z = 5;

    // Start animation loop
    this.animate();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(canvas));
  }

  // Add 3D objects
  addObject(object: THREE.Object3D) {
    if (this.scene) {
      this.scene.add(object);
    }
  }

  // Update object properties
  updateObjectProperty(objectName: string, property: string, value: any) {
    if (this.scene) {
      const obj = this.scene.getObjectByName(objectName);
      if (obj) {
        (obj as any)[property] = value;
      }
    }
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private onWindowResize(canvas: HTMLCanvasElement) {
    if (!this.camera || !this.renderer) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
  }
}