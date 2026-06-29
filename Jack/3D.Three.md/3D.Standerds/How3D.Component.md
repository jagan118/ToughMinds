
### Step 3: Consume the Service in your Component

Now your component stays clean, handling only the HTML lifecycle.

```typescript
// three-canvas.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ThreeSceneService } from './three-scene.service';

@Component({
  selector: 'app-three-canvas',
  template: `<canvas #rendererCanvas style="width: 100%; height: 100vh; display: block;"></canvas>`,
  styleUrls: ['./three-canvas.component.css']
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

```

---
