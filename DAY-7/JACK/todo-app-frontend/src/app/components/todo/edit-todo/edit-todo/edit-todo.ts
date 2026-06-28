// src/app/components/todo/edit-todo.component.ts

import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../../../services/todo.service';
import { Todo } from '../../../../models/interface';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:'./edit-todo.html',
  styleUrl:'./edit-todo.css'
})
export class EditTodoComponent implements OnInit {
  todoForm: FormGroup | null = null;
  loading = signal(false);
  error = signal<string | null>(null);
  todoId = '';

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      dueDate: [''],
      category: [''],
      completed: [false]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.todoId = params['id'];
      this.loadTodo();
    });
  }

  async loadTodo() {
    try {
      this.loading.set(true);
      const todo = await this.todoService.getTodoById(this.todoId);
      this.todoForm?.patchValue(todo);
    } catch (err: any) {
      this.error.set('Failed to load todo');
    } finally {
      this.loading.set(false);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.todoForm?.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.todoForm?.get(field);
    if (control?.hasError('required')) return `${field} required`;
    if (control?.hasError('maxlength')) return 'Too long';
    return '';
  }

  async onSubmit() {
    if (!this.todoForm || this.todoForm.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const updates = this.todoForm.value;
      await this.todoService.updateTodo(this.todoId, updates);
      this.router.navigate(['/todos']);
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.router.navigate(['/todos']);
  }
}