// three-canvas.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ThreeSceneService } from '../services/app1.service';

@Component({
  selector: 'app-three-canvas',
  standalone:true,
  template: `<canvas #rendererCanvas style="width: 200px; height: 200px; display: block;"></canvas>`,


})
export class ThreeCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: true }) public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private threeService: ThreeSceneService) {}

  ngAfterViewInit(): void {
    this.threeService.createScene(this.rendererCanvas.nativeElement);
  }

  ngOnDestroy(): void {
    // Standards look like this: avoiding memory leaks!
    this.threeService.destroyScene();
  }
}