// src/app/components/dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar/navbar';
import { TodoListComponent } from '../../todo/todo-list/todo-list/todo-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TodoListComponent],
  templateUrl:'./dashboard.html',
  styleUrl:'./dashboard.css'
})
export class DashboardComponent {}