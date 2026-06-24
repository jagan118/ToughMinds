import { Routes } from '@angular/router';
import { ArticleList } from './components/article-list/article-list';
import { ArticleDetail } from './components/article-detail/article-detail';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'articles',
    component: ArticleList
  },
  {
    path: 'articles/:id',
    component: ArticleDetail
  },
  {
    // Lazy load admin only when accessed
    path: 'admin',
    canActivate: [AuthGuard],  // Guard: only if logged in
    loadChildren: () => import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '',
    redirectTo: 'articles',
    pathMatch: 'full'
  }
];