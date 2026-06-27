import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductDetail } from './components/product-detail/product-detail';
import { LoginComponent } from './components/login/login';
import { AuthGuard } from './guards/auth.guard';
import { CartComponent } from './components/cart/cart';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail },
  {path:'cart',component:CartComponent},
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];