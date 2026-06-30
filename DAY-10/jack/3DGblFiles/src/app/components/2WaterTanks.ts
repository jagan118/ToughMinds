import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
@Component({
  selector: 'app-two-tanks',
  standalone: true,
  templateUrl: './two-water-tanks.html',
  styleUrl: './two-water-tanks.css',
})
export class TwoWaterTanksComponent implements AfterViewInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

     this.initScene();
    this.createLights();
    this.createTwoTanks();
    this.animate();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    const width = this.rendererContainer.nativeElement.clientWidth;
    const height = this.rendererContainer.nativeElement.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    this.camera.position.set(10, 10, 15);
    this.camera.lookAt(0, 3, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setSize(width, height);

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//    this.controls.target.set(0, 3, 0);
//    this.controls.update();
    this.controls.enablePan = false;
  }

  private createLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 2);

    directional.position.set(10, 20, 10);

    this.scene.add(directional);
  }

  private createTwoTanks(): void {
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0.7,
      roughness: 0.3,
    });

    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
    });

    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: 0xbbbbbb,
    });

    //tank templete
    const tank = new THREE.Group();
    //top radius,n\bottom radius,height,segments
    const bodyGeometry = new THREE.CylinderGeometry(2, 2, 5, 32);

    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    body.position.y = 4;

    tank.add(body);

    //tank top part
    const topGeometry = new THREE.CylinderGeometry(2.05, 2.05, 0.2, 32);

    const top = new THREE.Mesh(topGeometry, bodyMaterial);

    top.position.y = 6.6;

    tank.add(top);
    //tank bottom part
    const bottom = new THREE.Mesh(topGeometry, bodyMaterial);
    bottom.position.y = 1.4;
    tank.add(bottom);

    //legs for tank
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 13, 16);
    const leg = new THREE.Mesh(legGeometry,legMaterial);
    const positions = [
      [-1.3, 1.5, -1.3],
      [1.3, 1.5, -1.3],
      [-1.3, 1.5, 1.3],
      [1.3, 1.5, 1.3],
    ];

    positions.forEach((position) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);

      leg.position.set(position[0], position[1], position[2]);

    //   tank.add(leg);
    });

    // --- FIX: Create and place Tank 1 ---
    const tank1 = tank.clone();
    tank1.position.x = -4;
    tank1.position.y = 9; // Shift left
    this.scene.add(tank1);

    // --- FIX: Create and place Tank 2 ---
    const tank2 = tank.clone();
    tank2.position.x = 4; // Shift right
    this.scene.add(tank2);

    //pipes to connects tanks
       const pipeGeometry = new THREE.CylinderGeometry(
          0.2,
          0.2,
          2,
          16
        );
        const pipe = new THREE.Mesh(pipeGeometry,pipeMaterial);

        const pipe1 = pipe.clone();
        pipe1.position.set(4,2,0);
        pipe1.rotation.z = -Math.PI/2;
        pipe1.scale.set(2,5,2)
        tank1.add(pipe1);

        const pipe2 = pipe.clone();
        pipe2.position.set(3,5,0);
        pipe2.rotation.z = Math.PI/2;
        pipe2.scale.set(2,2,2)
        tank2.add(pipe2);

        const pipe3 = pipe.clone()
        pipe3.position.set(4.8,5,2);
        pipe3.rotation.x = Math.PI/2
        pipe3.scale.set(2,2,2)
        tank2.add(pipe3);

        const pipe4 = pipe.clone();
        pipe4.position.set(-3,2,0);
        pipe4.rotation.z = Math.PI/2;
        pipe4.scale.set(2,2,2)
        tank1.add(pipe4);

         const pipe5 = pipe.clone()
        pipe5.position.set(-4.8,4,0);
        pipe5.rotation.y = Math.PI/2
        pipe5.scale.set(2,2,2)
        tank1.add(pipe5);

        const pipe6 = pipe.clone();
        pipe6.position.set(9,-0.7,0);
        pipe6.scale.set(2,3,2)

        tank1.add(pipe6)


        const waterTower = new THREE.Group();
        const towerPlatform = new THREE.Mesh(
            new THREE.BoxGeometry(8,8,0.3),
            new THREE.MeshStandardMaterial({ color:0x90ee90})
        );
        towerPlatform.position.set(-4,10,0)
        towerPlatform.rotation.x =Math.PI/2
        this.scene.add(towerPlatform);

        const leg1 = leg.clone();
        leg1.position.set(-3,4,2);
        // leg1.scale.set(2,2.5,2);
        leg1.rotation.z = Math.PI/6;
        
        const leg2 = leg.clone();
        leg2.position.set(-5,4,2);
        // leg2.scale.set(2,2.5,2);
        leg2.rotation.z = -Math.PI/6;

        const leg3 = leg1.clone();
        leg3.position.set(-3,3,-3);
        leg3.scale.set(1,1.2,1)
        this.scene.add(leg3)
        
        
        const leg4 = leg2.clone();
        leg4.position.set(-5,3,-3);
        leg4.scale.set(1,1.2,1);
        this.scene.add(leg4);

        
        const supportGroup = new THREE.Group();

        const leg5 = leg1.clone();
        leg5.position.set(-3,4,6);
        // leg5.scale.set(0.6,1.2,1);
        leg5.rotation.z = Math.PI/6;

        supportGroup.add(leg5);
        
        const leg6 = leg2.clone();
        leg6.position.set(-5,4,6);
        // leg6.scale.set(1,1.2,1);
        leg6.rotation.z = -Math.PI/6;

        supportGroup.add(leg6);

        supportGroup.scale.set(0.6,0.9,1)
        this.scene.add(supportGroup)
        
        supportGroup.rotation.y = Math.PI/2
        supportGroup.position.set(-7,1,-3);
        
        const supportGroup2 = supportGroup.clone();
        supportGroup2.position.set(-13,1,-3)
        this.scene.add(supportGroup2)

        this.scene.add(leg1);
        this.scene.add(leg2);

    //ground
      const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(30, 30),
          new THREE.MeshStandardMaterial({
            color: 0x90ee90
          })
        );
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);

  }

   private animate = (): void => {

    requestAnimationFrame(this.animate);

    this.controls.update();
   
    this.renderer.render(
      this.scene,
      this.camera
    );

  };


}
