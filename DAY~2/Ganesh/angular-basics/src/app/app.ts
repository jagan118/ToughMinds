import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Counter } from './component/counter/counter';
import { TodoList } from './component/todo-list/todo-list';

@Component({
  selector: 'app-root',
  imports: [Counter, RouterOutlet, TodoList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-basics');
}
