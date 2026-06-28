// src/app/services/auth.service.ts

import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, AuthResponse } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  // Inject PLATFORM_ID to check if running in browser
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // Signup
  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
          email,
          password,
          name
        })
      );
      this.setUser(response);
      return response;
    } catch (error: any) {
      const errorMsg = error?.error?.message || 'Signup failed';
      throw new Error(errorMsg);
    }
  }

  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
          email,
          password
        })
      );
      this.setUser(response);
      return response;
    } catch (error: any) {
      const errorMsg = error?.error?.message || 'Invalid credentials';
      throw new Error(errorMsg);
    }
  }

  // Helper: Store user + token in state and localStorage
  private setUser(response: AuthResponse) {
    this.currentUser.set(response.user);
    this.isLoggedIn.set(true);
    
    // Only set localStorage if in browser environment
    if (this.isBrowser) {
      try {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
    }
  }

  // Logout
  logout() {
    console.log("loged out");
    
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    
    // Only remove from localStorage if in browser environment
    if (this.isBrowser) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
    }
  }

  // Get token from localStorage (safe)
  getToken(): string | null {
    
    // If not in browser, return null
    if (!this.isBrowser) {
      console.log("not in browser");
      return null;
    }
    
    try {
      console.log("have token");
      return localStorage.getItem('token');
    } catch (error) {
      console.warn('localStorage not available:', error);
      return null;
    }
  }

  // Check if logged in
  isLoggedInCheck(): boolean {
    const token = this.getToken();
    if (token && !this.isLoggedIn()) {
      if (this.isBrowser) {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          try {
            this.currentUser.set(JSON.parse(userJson));
          } catch {
            this.currentUser.set(null);
          }
        }
      }
      this.isLoggedIn.set(true);
    }
    return !!token;
  }

  // Load user from localStorage on app startup (safe)
  private loadUserFromStorage() {
    // Skip if not in browser
    if (!this.isBrowser) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');

      if (token && userJson) {
        const user = JSON.parse(userJson);
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
      }
    } catch (error) {
      console.warn('Error loading user from storage:', error);
      this.logout();
    }
  }

  // Clear all auth data (both signal and storage)
  clearAuthData() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    
    if (this.isBrowser) {
      try {
        localStorage.clear();
      } catch (error) {
        console.warn('Could not clear localStorage:', error);
      }
    }
  }
}