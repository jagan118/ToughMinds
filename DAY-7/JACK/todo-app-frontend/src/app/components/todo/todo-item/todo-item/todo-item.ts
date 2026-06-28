// src/app/components/todo/todo-item.component.ts

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../../models/interface';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-item.html',
  styleUrl:'./todo-item.css'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.todo._id);
  }

  onEdit() {
    this.edit.emit(this.todo._id);
  }

  onToggle() {
    this.toggle.emit(this.todo._id);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}