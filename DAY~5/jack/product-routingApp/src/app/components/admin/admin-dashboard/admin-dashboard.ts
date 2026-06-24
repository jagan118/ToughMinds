import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent {
  stats = {
    totalProducts: 20,
    totalSales: 5000,
    activeUsers: 150
  };

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}