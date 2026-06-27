// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard-guard';
import { LoginComponent } from './components/auth/login/login';
import { SignupComponent } from './components/auth/register/register';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard';
import { TodoListComponent } from './components/todo/todo-list/todo-list/todo-list';
import { AddTodoComponent } from './components/todo/add-todo/add-todo/add-todo';
import { EditTodoComponent } from './components/todo/edit-todo/edit-todo/edit-todo';
import { TeamDashboardComponent } from './components/team/team-dashboard/team-dashboard/team-dashboard';
import { TeamDetailComponent } from './components/team/team-detail/team-detail/team-detail';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },

  // Protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teams',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: TeamDashboardComponent
      },
      {
        path: ':teamId',
        component: TeamDetailComponent
      }
    ]
  },
  {
    path: 'todos',
    component: TodoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'todos/add',
    component: AddTodoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'todos/:id/edit',
    component: EditTodoComponent,
    canActivate: [AuthGuard]
  },

  // Redirects
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];