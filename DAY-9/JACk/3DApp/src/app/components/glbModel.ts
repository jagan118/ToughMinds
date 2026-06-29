import { 
  Component, 
  ElementRef, 
  ViewChild, 
  afterNextRender,
  OnDestroy 
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-gbl-model',
  standalone: true,
  template: `
    <div class="scada">
      <div #canvas class="canvas-container"></div>
      <div class="controls">
        <p>Speed: {{ speed }} RPM</p>
        <p>Temp: {{ temp }}°C</p>
        <button (click)="startPump()">START</button>
        <button (click)="stopPump()">STOP</button>
      </div>
    </div>
  `,
  styles: [`
    .scada {
      display: flex;
      gap: 20px;
      width: 100%;
      height: 100vh;
      background: #111;
      color: #fff;
    }
    .canvas-container {
      flex: 1;
      background: #222;
    }
    .controls {
      width: 250px;
      padding: 20px;
      background: #1a1a1a;
    }
    button {
      padding: 8px 16px;
      margin: 10px 0;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #0052a3;
    }
  `],
})
export class GblComponent implements OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef;
  
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private pump: any = null;
  private animationId: number | null = null;
  private sensorInterval: any = null;
  
  public speed = 0;
  public temp = 25;

  constructor() {
    afterNextRender(() => {
      this.initScene();
      this.loadPumpModel();
    });
  }
  
  private initScene() {
    try {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x222222);
      
      const width = this.canvasRef.nativeElement.clientWidth;
      const height = this.canvasRef.nativeElement.clientHeight;
      
      const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      );
      
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(0x222222);
      this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
      
      camera.position.z = 5;
      
      // Lighting
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      this.scene.add(directionalLight);
      
      // Animation loop
      const animate = () => {
        this.animationId = requestAnimationFrame(animate);
        
        if (this.pump && this.speed > 0) {
          this.pump.rotation.z += (this.speed / 1000) * 0.05;
        }
        
        this.renderer.render(this.scene, camera);
      };
      animate();
      
      window.addEventListener('resize', () => this.onWindowResize(camera));
      
    } catch (error) {
      console.error('Failed to initialize 3D scene:', error);
    }
  }
  
  private loadPumpModel() {
    // Dynamic import - works better with Vite/Angular 17+
    import('three/examples/jsm/loaders/GLTFLoader.js').then((module) => {
      const { GLTFLoader } = module;
      const loader = new GLTFLoader();
      
      const modelPath = '/assets/models/vintage_gas_pump.glb';
      
      loader.load(
        modelPath,
        (gltf) => {
          this.pump = gltf.scene;
          this.pump.scale.set(1, 1, 1);
          
          console.log('✅ Model loaded successfully!');
          console.log('Model structure:', gltf);
          
          this.scene.add(this.pump);
          this.simulateSensors();
        },
        (progress) => {
          const percent = (progress.loaded / progress.total * 100).toFixed(0);
          console.log(`📦 Loading: ${percent}%`);
        },
        (error) => {
          console.error('❌ Failed to load model:', error);
          console.error('Path attempted:', modelPath);
          alert('Model failed to load. Check console and verify file path.');
        }
      );
    }).catch((error) => {
      console.error('Failed to import GLTFLoader:', error);
    });
  }
  
  private simulateSensors() {
    this.sensorInterval = setInterval(() => {
      this.temp = 25 + Math.random() * 30;
      
      if (this.pump) {
        this.pump.traverse((child: any) => {
          if (child instanceof THREE.Mesh && child.material) {
            const tempRatio = this.temp / 60;
            const hue = 0.6 - (tempRatio * 0.6);
            
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.color.setHSL(hue, 1, 0.5);
            }
          }
        });
      }
    }, 100);
  }
  
  private onWindowResize(camera: THREE.PerspectiveCamera) {
    const width = this.canvasRef.nativeElement.clientWidth;
    const height = this.canvasRef.nativeElement.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  startPump() {
    this.speed = 1000;
  }
  
  stopPump() {
    this.speed = 0;
  }

  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.sensorInterval) clearInterval(this.sensorInterval);
    if (this.renderer) {
      this.renderer.dispose();
      this.canvasRef.nativeElement.removeChild(this.renderer.domElement);
    }
  }
}