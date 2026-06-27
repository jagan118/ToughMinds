import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  signUp(user: any) {
    return this.http.post<any>('http://localhost:3000/signUp', user)
  }
  login(user: any)
  {
    return this.http.post<any>('http://localhost:3000/login',user,
      {
        headers :{
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    )

  }

}
