import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WaterTankComponent } from './components/waterTank';
import { TwoWaterTanksComponent } from './components/2WaterTanks';

@Component({
  selector: 'app-root',
  imports: [WaterTankComponent,TwoWaterTanksComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
