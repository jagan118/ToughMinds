// src/app/guards/auth.guard.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.isBrowser) {
      // On server-side render, localStorage is unavailable.
      // Allow navigation and let client-side auth initialize.
      return true;
    }

    // Check if user is logged in from storage token
    const isLoggedIn = !!this.authService.getToken();
    if (isLoggedIn) {
      return true; // Allow access
    }

    // Redirect to login and preserve return URL
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false; // Block access
  }
}