// src/app/components/todo/todo-list.component.ts

import { Component, OnInit, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../../../services/todo.service';
import { TodoItemComponent } from '../../todo-item/todo-item/todo-item';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TodoItemComponent, FormsModule],
  templateUrl: './todo-list.html',
  styleUrl:'./todo-list.css'
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService)
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  todos = this.todoService.todos;
  loading = this.todoService.loading;
  error = this.todoService.error;
  
  searchControl = new FormControl('');
  selectedFilter = signal<'all' | 'completed' | 'pending'>('all');
  sortBy: 'title' | 'dueDate' | 'createdAt' = 'createdAt';

  filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Pending', value: 'pending' as const },
    { label: 'Completed', value: 'completed' as const }
  ];

  filteredTodos = computed(() => {
    const all = this.todoService.getFilteredTodos(this.selectedFilter());
    const searchQuery = this.searchControl.value?.toLowerCase() || '';

    if (!searchQuery) return all;

    return all.filter(
      todo =>
        todo.title.toLowerCase().includes(searchQuery) ||
        todo.description?.toLowerCase().includes(searchQuery)
    );
  });

  constructor(
    
    private router: Router
  ) {}

  ngOnInit() {
    if (this.isBrowser) {
      this.loadTodos();
    }

    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(async (value) => {

      console.log('Searching:', value);

      if (!value || value.trim() === '') {
        await this.loadTodos(); 
        return;
      }

      await this.todoService.searchTodos(value);
    });

  }

  async loadTodos() {
    try {
      await this.todoService.getTodos();
    } catch (error: any) {
      console.error('Load failed:', error);
    }
  }

  setFilter(filter: 'all' | 'completed' | 'pending') {
    this.selectedFilter.set(filter);
  }

  onSort() {
    this.todoService.sortTodos(this.sortBy);
  }

  async onDeleteTodo(id: string) {
    if (confirm('Delete this todo?')) {
      try {
        await this.todoService.deleteTodo(id);
      } catch (error: any) {
        console.error('Delete failed:', error);
      }
    }
  }

  onEditTodo(id: string) {
    this.router.navigate(['/todos', id, 'edit']);
  }

  async onToggleTodo(id: string) {
    try {
      await this.todoService.toggleComplete(id);
    } catch (error: any) {
      console.error('Toggle failed:', error);
    }
  }

  goToAddTodo() {
    this.router.navigate(['/todos/add']);
  }
}