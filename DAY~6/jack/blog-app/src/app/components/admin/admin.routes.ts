import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AddArticle } from './add-article/add-article';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboard
  },
  {
    path: 'add',
    component: AddArticle
  }
];