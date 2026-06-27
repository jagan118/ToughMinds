// src/app/app.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.services';
import { NavbarComponent } from './components/navbar/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  loading = true;
  showNavbar = false;
  
  ngOnInit() {
    console.log('🔄 App initializing...');

    this.updateNavbarVisibility(this.router.url);
    this.loading = false;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateNavbarVisibility(event.urlAfterRedirects);
    });
  }
  
  private updateNavbarVisibility(url: string) {
    const isLoggedIn = !!this.authService.getToken();
    this.showNavbar = isLoggedIn && !this.isPublicRoute(url);
  }

  private isPublicRoute(url: string): boolean {
    const publicRoutes = ['/login', '/signup'];
    return publicRoutes.some(route => url.includes(route));
  }
}