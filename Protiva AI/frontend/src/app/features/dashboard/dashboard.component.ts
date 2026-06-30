import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-brand-cream p-8">
      <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-brand-ink/5 shadow-md">
        <div class="flex justify-between items-center mb-8 border-b border-brand-ink/10 pb-6">
          <div>
            <h1 class="font-display text-4xl text-brand-ink font-semibold">Dashboard</h1>
            <p class="text-sm text-brand-muted mt-1">Manage your professional identity and brand presence.</p>
          </div>
          <button (click)="onLogout()" class="bg-brand-ink hover:bg-brand-emerald text-brand-cream px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
            Log Out
          </button>
        </div>
        
        <div class="bg-brand-cream/35 p-6 rounded-xl border border-brand-emerald/10 mb-6">
          <h2 class="text-lg font-bold text-brand-ink mb-2">Welcome back, {{ authService.currentUser()?.profile?.fullName || 'User' }}!</h2>
          <p class="text-sm text-brand-muted leading-relaxed">
            Your workspace is set up. You can start creating your professional portfolio using the wizard or the AI generation engine.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white border border-brand-ink/5 p-6 rounded-xl shadow-sm">
            <h3 class="font-semibold text-brand-ink mb-2">My Portfolios</h3>
            <p class="text-xs text-brand-muted mb-4">You haven't created any portfolios yet.</p>
            <button class="bg-brand-emerald hover:bg-brand-ink text-brand-cream px-4 py-2 rounded-full text-xs font-semibold transition-colors">
              Create First Portfolio
            </button>
          </div>
          <div class="bg-white border border-brand-ink/5 p-6 rounded-xl shadow-sm">
            <h3 class="font-semibold text-brand-ink mb-2">Account Details</h3>
            <div class="text-xs text-brand-muted space-y-1">
              <p>Email: <span class="font-semibold text-brand-ink">{{ authService.currentUser()?.email }}</span></p>
              <p>Role: <span class="font-semibold text-brand-ink">{{ authService.currentUser()?.role }}</span></p>
              <p>Status: <span class="font-semibold text-brand-emerald">{{ authService.currentUser()?.status }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  public authService = inject(AuthService);

  public onLogout(): void {
    this.authService.logout().subscribe();
  }
}
