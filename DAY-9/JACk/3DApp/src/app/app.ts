import { Component, signal } from '@angular/core';
import { ScadaComponent } from './components/scada';
import { ThreeCanvasComponent } from './components/app1';
import { GblComponent } from './components/glbModel';
@Component({
  selector: 'app-root',
  imports: [ScadaComponent,ThreeCanvasComponent,GblComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
