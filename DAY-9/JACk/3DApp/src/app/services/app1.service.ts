// three-scene.service.ts
import { Injectable, ElementRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import * as THREE from 'three';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class ThreeSceneService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private wireframeModel!: THREE.LineSegments;
  private frameId: number | null = null;

  // NgZone is crucial to prevent Angular from running change detection on every single frame loop
  constructor(private ngZone: NgZone,@Inject(PLATFORM_ID) private platformId:Object) {}

  public createScene(canvas: HTMLCanvasElement): void {
    if(!isPlatformBrowser(this.platformId)){
        return 
    }
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true,alpha:true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);


     const ambientLight = new THREE.AmbientLight(0x444444);
      this.scene.add(ambientLight);


    const box = new THREE.BoxGeometry(2,2,2);
    const geometry = new THREE.EdgesGeometry(box)
    // const geometry = new THREE.WireframeGeometry(box)
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
     this.wireframeModel = new THREE.LineSegments(geometry, material);
      this.scene.add(this.wireframeModel);
    
  

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
    if (!this.wireframeModel) {
    return; 
  }

    // Animation logic
    this.wireframeModel.rotation.x += 0.01;
    this.wireframeModel.rotation.y += 0.01;

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