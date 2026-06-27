// src/app/services/todo.service.ts

import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Todo } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api/todos'; 
  // State management
  todos = signal<Todo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // Get all todos
  async getTodos(): Promise<Todo[]> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const response = await firstValueFrom(
        this.http.get<{ data: Todo[] }>(`${this.apiUrl}`)
      );
      const todos = response.data || [];
      this.todos.set(todos);
      return todos;
    } catch (error: any) {
      const errorMsg =
        error?.error?.message ||
        error?.message ||
        'Failed to load todos';
      console.error('TodoService.getTodos error:', error);
      this.error.set(errorMsg);
      throw new Error(errorMsg);
    } finally {
      this.loading.set(false);
    }
  }

  // Get single todo by ID
  async getTodoById(id: string): Promise<Todo> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: Todo }>(`${this.apiUrl}/${id}`)
      );
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to load todo');
    }
  }

  // Create new todo
  async createTodo(
    title: string,
    description: string,
    dueDate?: Date,
    category?: string,
    teamId?: string
  ): Promise<Todo> {
    try {
      this.error.set(null);
      const response = await firstValueFrom(
        this.http.post<{ data: Todo }>(`${this.apiUrl}`, {
          title,
          description,
          dueDate,
          category,
          teamId
        })
      );

      // Add new todo to signal
      const newTodo = response.data;
      this.todos.set([...this.todos(), newTodo]);
      return newTodo;
    } catch (error: any) {
      const errorMsg = error?.error?.message || 'Failed to create todo';
      this.error.set(errorMsg);
      throw new Error(errorMsg);
    }
  }

  // Update todo
  async updateTodo(
    id: string,
    updates: Partial<Todo>
  ): Promise<Todo> {
    try {
      this.error.set(null);
      const response = await firstValueFrom(
        this.http.put<{ data: Todo }>(`${this.apiUrl}/${id}`, updates)
      );

      // Update in signal
      const updated = response.data;
      this.todos.set(
        this.todos().map(t => (t._id === id ? updated : t))
      );
      return updated;
    } catch (error: any) {
      const errorMsg = error?.error?.message || 'Failed to update todo';
      this.error.set(errorMsg);
      throw new Error(errorMsg);
    }
  }

  // Delete todo
  async deleteTodo(id: string): Promise<void> {
    try {
      this.error.set(null);
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/${id}`)
      );

      // Remove from signal
      this.todos.set(this.todos().filter(t => t._id !== id));
    } catch (error: any) {
      const errorMsg = error?.error?.message || 'Failed to delete todo';
      this.error.set(errorMsg);
      throw new Error(errorMsg);
    }
  }

  // Toggle completed status
  async toggleComplete(id: string): Promise<Todo> {
    try {
      this.error.set(null);
      const response = await firstValueFrom(
        this.http.patch<{ data: Todo }>(`${this.apiUrl}/${id}/toggle`, {})
      );

      // Update in signal
      const updated = response.data;
      this.todos.set(
        this.todos().map(t => (t._id === id ? updated : t))
      );
      return updated;
    } catch (error: any) {
      throw new Error('Failed to toggle todo');
    }
  }

  // Search todos
  async searchTodos(query: string): Promise<Todo[]> {
    try {
      this.loading.set(true);
      const params = new HttpParams().set('q', query);
      const response = await firstValueFrom(
        this.http.get<{ data: Todo[] }>(`${this.apiUrl}/search`, { params })
      );
      const results = response.data || [];
      this.todos.set(results);
      return results;
    } catch (error: any) {
      throw new Error('Search failed');
    } finally {
      this.loading.set(false);
    }
  }

  // Sort todos
  sortTodos(by: 'title' | 'dueDate' | 'createdAt'): Todo[] {
    const sorted = [...this.todos()].sort((a, b) => {
      if (by === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (by === 'dueDate') {
        return (
          (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
          (b.dueDate ? new Date(b.dueDate).getTime() : Infinity)
        );
      }
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
    this.todos.set(sorted);
    return sorted;
  }

  // Filter todos
  getFilteredTodos(filter: 'all' | 'completed' | 'pending'): Todo[] {
    const all = this.todos();
    if (filter === 'completed') {
      return all.filter(t => t.completed);
    }
    if (filter === 'pending') {
      return all.filter(t => !t.completed);
    }
    return all;
  }
}