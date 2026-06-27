import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `https://dummyjson.com/products`;
  productsSubject = new BehaviorSubject<any>([]);
  products$ = this.productsSubject.asObservable();
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getProductDetailsById(id: number): Observable<any> {
    return this.http.get<any>(`https://dummyjson.com/products/${id}`);
  }
  getProductsBySearchInput(searchValue: string) {
    return this.http.get<any>(`https://dummyjson.com/products/search?q=${searchValue}`);
  }
  updateProducts(products: any)
  {
    this.productsSubject.next([...products]);
    console.log(products);
    
  }
}
