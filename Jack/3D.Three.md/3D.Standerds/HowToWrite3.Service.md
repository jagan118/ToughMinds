
---

## 1. The Standard Setup (TypeScript)

### Step 1: Install Three.js and its Types

Run this in your project terminal to get full auto-complete and type-checking support:

```bash
npm install three
npm install --save-dev @types/three

```

### Step 2: Create a Dedicated Angular Service

Don't clutter your component with all the heavy Three.js logic (scene setup, animations, resizing). Instead, delegate that to a service. This keeps your code modular and reusable.

```typescript
// three-scene.service.ts
import { Injectable, ElementRef, NgZone } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class ThreeSceneService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private frameId: number | null = null;

  // NgZone is crucial to prevent Angular from running change detection on every single frame loop
  constructor(private ngZone: NgZone) {}

  public createScene(canvas: HTMLCanvasElement): void {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.animate();
  }
  

  private animate(): void {
    // We run this OUTSIDE Angular's zone so it doesn't slow down the rest of your app
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => this.render());
      }
    });
  }

  private render(): void {
    this.frameId = requestAnimationFrame(() => this.render());

    // Animation logic
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  // CRITICAL STANDARD: Clean up memory when the component is destroyed
  public destroyScene(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

```

