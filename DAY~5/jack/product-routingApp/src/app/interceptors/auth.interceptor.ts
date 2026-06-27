import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get JWT token
    const token = this.authService.getToken();

    // Clone request + add JWT header
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle errors
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('HTTP Error:', err.status, err.message);

        // 401 = token expired, logout
        if (err.status === 401) {
          this.authService.logout();
          alert('Session expired. Please login again.');
        }

        return throwError(() => err);
      })
    );
  }
}