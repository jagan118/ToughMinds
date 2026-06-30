import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of, map } from 'rxjs';
import { IUser, IAuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Angular Signals for reactive application state
  private userSignal = signal<IUser | null>(null);
  public currentUser = this.userSignal.asReadonly();
  public isAuthenticated = computed(() => this.userSignal() !== null);

  // In-memory token storage (Access Token)
  private token: string | null = null;
  private readonly REFRESH_TOKEN_KEY = 'portiva_refresh_token';

  constructor() {
    // Attempt to restore user session on bootstrap if refresh token exists
    if (this.getRefreshToken()) {
      this.loadCurrentUser().subscribe({
        error: () => this.clearSession()
      });
    }
  }

  public getAccessToken(): string | null {
    return this.token;
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private setSession(accessToken: string, refreshToken: string, user?: any): void {
    this.token = accessToken;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    if (user) {
      this.userSignal.set(user);
    }
  }

  private clearSession(): void {
    this.token = null;
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.userSignal.set(null);
  }

  public register(email: string, passwordHash: string, fullName: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>('/api/v1/auth/register', { email, password: passwordHash, fullName }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(
            res.data.accessToken,
            res.data.refreshToken,
            {
              id: res.data.user.id,
              email: res.data.user.email,
              role: res.data.user.role,
              profile: { fullName: res.data.user.fullName }
            }
          );
        }
      })
    );
  }

  public login(email: string, passwordHash: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>('/api/v1/auth/login', { email, password: passwordHash }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(
            res.data.accessToken,
            res.data.refreshToken,
            {
              id: res.data.user.id,
              email: res.data.user.email,
              role: res.data.user.role,
              profile: { fullName: res.data.user.fullName }
            }
          );
        }
      })
    );
  }

  public logout(): Observable<any> {
    return this.http.post('/api/v1/auth/logout', {}).pipe(
      tap(() => {
        this.clearSession();
        this.router.navigate(['/auth/login']);
      }),
      catchError((err) => {
        this.clearSession();
        this.router.navigate(['/auth/login']);
        return throwError(() => err);
      })
    );
  }

  public refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearSession();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>(
      '/api/v1/auth/refresh',
      { refreshToken }
    ).pipe(
      map(res => res.data),
      tap(data => {
        this.setSession(data.accessToken, data.refreshToken);
      }),
      catchError(err => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  public loadCurrentUser(): Observable<IUser> {
    return this.http.get<{ success: boolean; data: IUser }>('/api/v1/auth/me').pipe(
      map(res => res.data),
      tap(user => {
        this.userSignal.set(user);
      }),
      catchError(err => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }
}
