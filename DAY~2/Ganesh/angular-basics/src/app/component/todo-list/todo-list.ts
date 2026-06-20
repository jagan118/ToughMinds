import { Component, signal } from '@angular/core';
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})


export class TodoList {
  todos = signal<Todo[]>([]);
  addTodo(Title: string) {
    const newTodo: Todo = {
      id: Date.now(),
      title: Title,
      completed: false,
    };
    this.todos.update(currentTodos => [...currentTodos, newTodo])
  }
  completeTodo(id: number) {
    this.todos.update(currentTodos => currentTodos.map(todo => todo.id == id ? { ...todo, completed: !todo.completed } : todo));
    // console.log(this.todos);
  }
  deleteTodo(id:number)
  {
    this.todos.update(currentTodos => currentTodos.filter(todo => todo.id !== id));
  }
}

