// src/app/components/todo/add-todo.component.ts

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

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-todo.html',
  styleUrl:'./add-todo.css'
})
export class AddTodoComponent implements OnInit {
  todoForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  teamId = '';

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
      category: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.teamId = params['teamId'] || '';
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.todoForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.todoForm.get(field);
    if (control?.hasError('required')) return `${field} required`;
    if (control?.hasError('maxlength')) return 'Too long';
    return '';
  }

  async onSubmit() {
    if (this.todoForm.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const { title, description, dueDate, category } = this.todoForm.value;
      await this.todoService.createTodo(
        title,
        description,
        dueDate,
        category,
        this.teamId || undefined
      );

      if (this.teamId) {
        this.router.navigate(['/teams', this.teamId]);
      } else {
        this.router.navigate(['/todos']);
      }
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