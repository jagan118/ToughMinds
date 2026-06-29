import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { ThreeService } from '../services/three.service';
import * as THREE from 'three';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-scada',
  template: `
    <div class="scada-container">
      <div #canvasContainer class="canvas-wrapper"></div>
      <div class="control-panel">
        <h3>Pump Status</h3>
        <p>Temperature: {{ sensorData.temperature | number: '1.0-0' }}°C</p>
        <p>Speed: {{ sensorData.speed | number: '1.0-0' }} RPM</p>
        <button (click)="increasePumpSpeed()">↑ Speed Up</button>
        <button (click)="decreasePumpSpeed()">↓ Slow Down</button>
      </div>
    </div>
  `,
  imports:[DecimalPipe],
  styles: [`
    .scada-container {
      display: flex;
      gap: 20px;
      padding: 20px;
      background: #111;
      color: #fff;
      height: 100vh;
    }
    .canvas-wrapper {
      flex: 1;
      border: 1px solid #444;
      background: #222;
    }
    .control-panel {
      width: 250px;
      background: #1a1a1a;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #444;
    }
    button {
      display: block;
      margin: 10px 0;
      padding: 8px 16px;
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
export class ScadaComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;

  sensorData = {
    temperature: 35,
    speed: 0,
  };

  private pumpGroup: THREE.Group | null = null;
  private sensorInterval: any = null;
  private isBrowser = false;
  constructor(private threeService: ThreeService, @Inject(PLATFORM_ID) platformId: Object
  ) {
    // Check if we're running in browser
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {

     if (!this.isBrowser) return;
    // ViewChild is ready NOW
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    this.canvasContainer.nativeElement.appendChild(canvas);

    // Initialize Three.js with the canvas
    this.threeService.init(canvas);

    this.createPumpVisualization();
    this.simulateSensorData();
  }

  createPumpVisualization() {
    this.pumpGroup = new THREE.Group();
    this.pumpGroup.name = 'pump';

    // Motor
    const motorGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const motorMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff });
    const motor = new THREE.Mesh(motorGeometry, motorMaterial);
    motor.name = 'motor';

    // Impeller
    const impellerGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const impellerMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 });
    const impeller = new THREE.Mesh(impellerGeometry, impellerMaterial);
    impeller.position.z = 0.6;
    impeller.name = 'impeller';

    // Pipe
    const pipeGeometry = new THREE.BoxGeometry(0.2, 0.2, 2);
    const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe.position.set(0.7, 0, 1);
    pipe.name = 'pipe';

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.threeService.addObject(light);

    this.pumpGroup.add(motor);
    this.pumpGroup.add(impeller);
    this.pumpGroup.add(pipe);
    this.threeService.addObject(this.pumpGroup);
  }

  simulateSensorData() {
    this.sensorInterval = setInterval(() => {
      this.sensorData.temperature = 30 + Math.random() * 20;

      if (this.pumpGroup) {
        const motor = this.pumpGroup.getObjectByName('motor') as THREE.Mesh;
        if (motor && motor.material instanceof THREE.MeshStandardMaterial) {
          const tempRatio = this.sensorData.temperature / 60;
          const hue = 0.6 - tempRatio * 0.6;
          motor.material.color.setHSL(hue, 1, 0.5);
        }

        const impeller = this.pumpGroup.getObjectByName('impeller') as THREE.Mesh;
        if (impeller) {
          impeller.rotation.z += (this.sensorData.speed / 100) * 0.1;
        }
      }
    }, 100);
  }

  increasePumpSpeed() {
    this.sensorData.speed = Math.min(this.sensorData.speed + 100, 1000);
  }

  decreasePumpSpeed() {
    this.sensorData.speed = Math.max(this.sensorData.speed - 100, 0);
  }

  ngOnDestroy() {
    if (this.sensorInterval) clearInterval(this.sensorInterval);
    this.threeService.dispose();
  }
}