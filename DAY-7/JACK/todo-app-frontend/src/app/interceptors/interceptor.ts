// src/app/interceptors/auth.interceptor.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.services';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only add token if in browser environment
    console.log('Interceptor running');
    if (this.isBrowser) {
      const token = this.authService.getToken();

      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // 401: Unauthorized - token expired or invalid
        if (error.status === 401) {
          if (this.isBrowser) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return EMPTY;
        }

        // 400: Bad Request - validation error
        if (error.status === 400) {
          const message = error.error?.message || 'Invalid request';
          return throwError(() => new Error(message));
        }

        // 500: Server error
        if (error.status === 500) {
          return throwError(() => new Error('Server error. Try again later.'));
        }

        // Network error
        if (error.status === 0) {
          return throwError(
            () => new Error('Network error. Check your connection.')
          );
        }

        return throwError(() => error);
      })
    );
  }
}