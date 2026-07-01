import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WaterFlow } from './components/water-flow/water-flow';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,WaterFlow],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('3dAnimations');
}
