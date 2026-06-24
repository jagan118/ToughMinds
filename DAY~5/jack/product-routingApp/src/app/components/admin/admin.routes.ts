import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then(
        m => m.AdminDashboardComponent
      )
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./edit-product/edit-product').then(
        m => m.EditProductComponent
      )
  }
];