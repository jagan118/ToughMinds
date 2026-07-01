import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener, NgZone } from '@angular/core';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
@Component({
  selector: 'app-water-flow',
  imports: [],
  templateUrl: './water-flow.html',
  styleUrl: './water-flow.css',
})
export class WaterFlow {
  @ViewChild('rendererCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private orbitControls!: OrbitControls;
  private camera!: THREE.PerspectiveCamera;
  private animationFrameId!: number;
  private flowSpeed: number = 0;
  private isSystemRunning: boolean = false;
  private waterInTank1!: THREE.Mesh;
  private waterInTank2!: THREE.Mesh
  private valveGroup!: THREE.Group;
  private effectComposer!: EffectComposer;
  constructor(private ngZone: NgZone) { }
  ngAfterViewInit(): void {
    this.initThreeJS();
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    })
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.renderer.dispose();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

    // const geometry = new THREE.PlaneGeometry(10, 10);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.DoubleSide });
    // const plane = new THREE.Mesh(geometry, material);
    // this.scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);

    const dummyCanvas = document.createElement('canvas');
    dummyCanvas.width = 128;
    dummyCanvas.height = 128;
    const ctx = dummyCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0077ff';
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = '#33a3ff';
      ctx.fillRect(0, 40, 128, 48);
    }

    const waterTexture = new THREE.CanvasTexture(dummyCanvas);
    waterTexture.wrapS = THREE.RepeatWrapping; // Allows horizontal looping
    waterTexture.wrapT = THREE.RepeatWrapping; // Allows vertical looping
    waterTexture.repeat.set(4, 1);             // Tweak how squished the waves look

    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.3,
      wireframe: false
    });

    // const waterFlowMaterial = new THREE.MeshStandardMaterial({
    //     color: 0xcccccc,
    //     transparent: true,
    //     opacity: 0,
    //     wireframe: false
    // });

    const waterMaterial = new THREE.MeshStandardMaterial({
      map: waterTexture,
      roughness: 0.1
    });

    const tankGeo = new THREE.BoxGeometry(2, 3, 2); // Width, Height, Depth
    const tank1 = new THREE.Mesh(tankGeo, glassMaterial);
    tank1.position.set(-4, 0, 0); // Move 4 units to the LEFT (Negative X)
    this.scene.add(tank1);

    // Water inside Tank 1 (Child of Tank 1)
    const water1Geo = new THREE.BoxGeometry(1.9, 2.8, 1.9); // Slightly smaller than tank
    this.waterInTank1 = new THREE.Mesh(water1Geo, waterMaterial);
    this.waterInTank1.position.set(0, 0, 0); // Center inside parent tank
    tank1.add(this.waterInTank1);

    // --- TANK 2 (Destination Tank on the Right) ---
    const tank2 = new THREE.Mesh(tankGeo, glassMaterial);
    tank2.position.set(4, 0, 0); // Move 4 units to the RIGHT (Positive X)
    this.scene.add(tank2);

    // Water inside Tank 2 (Starts completely flat/empty)
    this.waterInTank2 = new THREE.Mesh(water1Geo, waterMaterial);
    this.waterInTank2.position.set(0, -1.4, 0); // Move down to bottom of tank
    this.waterInTank2.scale.set(1, 0.01, 1);    // Scale height to almost 0 (Empty)
    tank2.add(this.waterInTank2);


    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const pipe = new THREE.Mesh(pipeGeo, waterMaterial);

    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, -1, 0);
    this.scene.add(pipe);


    this.valveGroup = new THREE.Group();

    const valveMaterial = new THREE.MeshStandardMaterial({
      color: 0xcc0000,
      roughness: 0.4,
      metalness: 0.2
    });

    const rimGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.08, 16);
    const rim = new THREE.Mesh(rimGeo, valveMaterial);
    this.valveGroup.add(rim);

    const spokeGeo = new THREE.BoxGeometry(1.0, 0.2, 0.1);
    const spoke = new THREE.Mesh(spokeGeo, valveMaterial);
    spoke.position.y += 0.2;
    this.valveGroup.add(spoke);

    this.valveGroup.position.set(0, -0.75, 0); // Sit right on top of the horizontal pipe center

    this.valveGroup.rotation.y = Math.PI / 2;

    this.scene.add(this.valveGroup);

    //Click using ray casting
    const mouseClick = new THREE.Vector2();
    const rayCaster = new THREE.Raycaster();

    //Implementing selection Outliner when hover an object

    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.setSize(window.innerWidth, window.innerHeight);

    //add renderPass to composer\
    const renderPass = new RenderPass(this.scene, this.camera);
    this.effectComposer.addPass(renderPass);

    const outLinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    )
    this.effectComposer.addPass(outLinePass);
    outLinePass.edgeStrength = 4;
    outLinePass.edgeGlow = 1;
    outLinePass.edgeThickness = 1;
    outLinePass.visibleEdgeColor.set('#ffcc00')
    outLinePass.hiddenEdgeColor.set('#111111');

    // let isSystemRunning = false;


    const onMouseClick = (event: MouseEvent) => {
      mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseClick.y = -(event.clientY / window.innerHeight) * 2 + 1;
      rayCaster.setFromCamera(mouseClick, this.camera);
      const intersects = rayCaster.intersectObjects(this.valveGroup.children, true)
      if (intersects.length > 0) {
        console.log("valurGroup clicked..");
        this.isSystemRunning = this.isSystemRunning ? false : true;
      }
    }

    const onMouseMove = (event: MouseEvent) => {
      mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseClick.y = -(event.clientY / window.innerHeight) * 2 + 1;
      rayCaster.setFromCamera(mouseClick, this.camera);
      const intersects = rayCaster.intersectObjects(this.valveGroup.children, true)
      if (intersects.length > 0) {
        outLinePass.selectedObjects = [this.valveGroup];
        document.body.style.cursor = 'pointer';
      } else {
        outLinePass.selectedObjects = [];
        document.body.style.cursor = 'default';
      }
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onMouseClick, false);
  }
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    if (this.isSystemRunning && this.flowSpeed < 1) {
      this.updateFlow();
    }
    this.orbitControls.update();
    // this.renderer.render(this.scene, this.camera);
    this.effectComposer.render();
  }

  private updateFlow(): void {
    this.flowSpeed += 0.005;
    this.valveGroup.rotation.y += 0.04;
    // this.waterTexture.offset.x -= 0.03;


    this.waterInTank1.scale.y = 1 - this.flowSpeed;
    this.waterInTank1.position.y = - (this.flowSpeed * 1.4);


    this.waterInTank2.scale.y = this.flowSpeed;
    this.waterInTank2.position.y = -1.4 + (this.flowSpeed * 1.4);

    if (this.flowSpeed >= 0.5) {
      this.flowSpeed = 1;
    }
  }
};