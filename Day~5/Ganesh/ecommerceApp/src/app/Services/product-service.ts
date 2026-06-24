import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `https://dummyjson.com/products`;
  getProducts(): Observable<any>
  {
  return this.http.get<any>(this.apiUrl);
  }
   getProductDetailsById(id: number): Observable<any>
  {
      return this.http.get<any>(`https://dummyjson.com/products/${id}`);
  }
}
