// src/app/components/navbar/navbar.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.services';
import { filter } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser: any = null;
  isLoggedIn = false;
  currentRoute: string = '';
  
  ngOnInit() {
    // ✅ Get user from signal
    this.currentUser = this.authService.currentUser();
    this.isLoggedIn = this.authService.isLoggedInCheck();
    
    console.log('✅ Navbar loaded. User:', this.currentUser?.name);
    
    // Track current route for active link styling
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }
  
  // ========== LOGOUT ==========
  logout() {
    console.log('🚪 Logging out...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  // ========== CHECK IF ROUTE IS ACTIVE ==========
  isActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}