import { AfterViewInit, Component, ElementRef, ViewChild,Inject,
  PLATFORM_ID } from '@angular/core';
import * as THREE from 'three';
import { isPlatformBrowser } from '@angular/common';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
@Component({
  selector: 'app-water-tank',
  standalone: true,
  template: `
    <div
      #rendererContainer
      style="width:100%; height:100vh; display:block;">
    </div>
  `
})
export class WaterTankComponent implements AfterViewInit {

  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!:OrbitControls;
  private cube!:THREE.Mesh;


  constructor(
  @Inject(PLATFORM_ID)
  private platformId: Object
) {}

  ngAfterViewInit(): void {
     if (!isPlatformBrowser(this.platformId)) {
    return;
  }
    this.initScene();
    this.createLights();
    this.createWaterTank();
    this.animate();
  }

  private initScene(): void {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    const width = this.rendererContainer.nativeElement.clientWidth;
    const height = this.rendererContainer.nativeElement.clientHeight;

    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );

    this.camera.position.set(10, 10, 15);
    this.camera.lookAt(0, 3, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    this.renderer.setSize(width, height);

    this.rendererContainer.nativeElement.appendChild(
      this.renderer.domElement
    );

    this.controls = new OrbitControls(
        this.camera,
        this.renderer.domElement
    );
    this.controls.enablePan =false;
  }

  private createLights(): void {

    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 2);

    directional.position.set(10, 20, 10);

    this.scene.add(directional);

  }

  private createWaterTank(): void {


        const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0.7,
      roughness: 0.3
    });


    const cubeGeo = new THREE.BoxGeometry(3,3,3);
     this.cube = new THREE.Mesh(cubeGeo,bodyMaterial)
    const cube1 = new THREE.Mesh(cubeGeo,bodyMaterial)

    this.cube.position.set(7,2,-8);
    cube1.position.set(10,2,0);

    this.cube.rotation.x = Math.PI /4;
    // cube.rotation.y += 0.01;
    // cube.rotation.z = Math.PI /4;
    this.cube.scale.x = 2;
    
    // cube1.scale.x = 2
    // cube1.scale.y = 2
    // cube1.scale.z = 2

    cube1.scale.set(2,2,2)
    
    this.scene.add(this.cube);
    this.scene.add(cube1);





    const tank = new THREE.Group();

    //------------------------------------
    // Materials
    //------------------------------------


    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333
    });

    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: 0xbbbbbb
    });

    //------------------------------------
    // Tank Body
    //------------------------------------

    const bodyGeometry = new THREE.CylinderGeometry(
      2,
      2,
      5,
      32
    );

    const body = new THREE.Mesh(
      bodyGeometry,
      bodyMaterial
    );

    body.position.y = 4;

    tank.add(body);

    //------------------------------------
    // Top Lid
    //------------------------------------

    const topGeometry = new THREE.CylinderGeometry(
      2.05,
      2.05,
      0.2,
      32
    );

    const top = new THREE.Mesh(
      topGeometry,
      bodyMaterial
    );

    top.position.y = 6.6;

    tank.add(top);

    //------------------------------------
    // Bottom Lid
    //------------------------------------

    const bottom = new THREE.Mesh(
      topGeometry,
      bodyMaterial
    );

    bottom.position.y = 1.4;

    tank.add(bottom);

    //------------------------------------
    // Legs
    //------------------------------------

    const legGeometry = new THREE.CylinderGeometry(
      0.15,
      0.15,
      4,
      16
    );

    const positions = [
      [-1.3, 1.5, -1.3],
      [1.3, 1.5, -1.3],
      [-1.3, 1.5, 1.3],
      [1.3, 1.5, 1.3]
    ];

    positions.forEach(position => {

      const leg = new THREE.Mesh(
        legGeometry,
        legMaterial
      );

      leg.position.set(
        position[0],
        position[1],
        position[2]
      );

      tank.add(leg);

    });

    //------------------------------------
    // Outlet Pipe
    //------------------------------------

    const pipeGeometry = new THREE.CylinderGeometry(
      0.2,
      0.2,
      2,
      16
    );

    const outlet = new THREE.Mesh(
      pipeGeometry,
      pipeMaterial
    );

    outlet.position.set(
      0,
      -1,
      0
    );

    tank.add(outlet);

    //------------------------------------
    // Inlet Pipe
    //------------------------------------

    const inlet = new THREE.Mesh(
      pipeGeometry,
      pipeMaterial
    );

    inlet.position.set(
      0,
      7,
      0
    );

    tank.add(inlet);

    //------------------------------------
    // Horizontal Pipe
    //------------------------------------

    const horizontalPipe = new THREE.Mesh(
      pipeGeometry,
      pipeMaterial
    );

    horizontalPipe.rotation.z = Math.PI / 2;

    horizontalPipe.position.set(
      1,
      -2,
      0
    );

    tank.add(horizontalPipe);

    //------------------------------------
    // Ground
    //------------------------------------

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({
        color: 0x90ee90
      })
    );

    ground.rotation.x = -Math.PI / 2;

    this.scene.add(ground);

    //------------------------------------
    // Add Tank
    //------------------------------------

    this.scene.add(tank);

  }

  private animate = (): void => {

    requestAnimationFrame(this.animate);

    this.controls.update();
    // this.cube.rotation.y += 0.01;
    // this.cube.rotation.x +=0.01
    this.cube.rotation.z +=0.1

    this.renderer.render(
      this.scene,
      this.camera
    );

  };

}