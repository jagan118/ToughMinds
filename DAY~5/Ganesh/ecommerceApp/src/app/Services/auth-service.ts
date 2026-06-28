import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal(!!localStorage.getItem('token'));
  private http = inject(HttpClient);

  signUp(user: any) {
    return this.http.post<any>('http://localhost:3000/signUp', user);
  }

  login(user: any) {
    return this.http.post<any>('http://localhost:3000/login', user);
  }

  setAuthData(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn.set(false);
  }
}
