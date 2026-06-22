import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TicketForm } from './ticket-form/ticket-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TicketForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('formHandlingAng');
}
