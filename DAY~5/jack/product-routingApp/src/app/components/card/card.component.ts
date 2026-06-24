import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[cardTitle]"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer">
        <ng-content select="[cardFooter]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .card-header { background: #f0f0f0; padding: 15px; font-weight: bold; }
    .card-body { padding: 15px; }
    .card-footer { background: #f9f9f9; padding: 10px; text-align: right; }
  `]
})
export class CardComponent {}