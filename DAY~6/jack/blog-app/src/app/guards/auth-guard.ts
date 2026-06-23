import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private isLoggedIn = false;  // Fake auth state (later from service)

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.isLoggedIn) {
      return true;  // Allow access
    } else {
      alert('Login required!');
      this.router.navigate(['/articles']);  // Redirect to articles
      return false;  // Block access
    }
  }

  // Method to toggle login (for testing)
  login() {
    this.isLoggedIn = true;
  }
}