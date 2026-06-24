import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  retry,
  map,
  shareReplay // <-- 1. Import shareReplay
} from 'rxjs/operators';

interface DummyJsonResponse {
  products: any[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  private searchSubject = new BehaviorSubject<string>('');
  public search$ = this.searchSubject.asObservable();

  // 2. Create a cache variable to hold the stream reference
  private productsCache$?: Observable<any[]>;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    // 3. If cache stream doesn't exist yet, initialize it
    if (!this.productsCache$) {
      this.productsCache$ = this.http.get<DummyJsonResponse>(this.apiUrl).pipe(
        retry(2),
        map(response => response.products),
        shareReplay(1), // <-- 4. Caches the array in memory for all future subscribers
        catchError(err => {
          console.error('Error loading products:', err);
          // Clear cache on error so a retry can actually try hitting the network again
          this.productsCache$ = undefined; 
          return throwError(() => new Error('Failed to load products'));
        })
      );
    }
    return this.productsCache$;
  }

  getSearchResults(): Observable<any[]> {
    return this.search$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query.trim()) {
          return this.getProducts(); // Instantly returns cached products!
        }
        
        return this.getProducts().pipe(
          map(products =>
            products.filter(p =>
              p.title.toLowerCase().includes(query.toLowerCase())
            )
          )
        );
      }),

      catchError(err => {
        console.error('Search error:', err);
        return of([]);
      })
    );
  }

 getProductById(id: number): Observable<any> {
  // Leverage the existing list cache if available, otherwise fetch the full list
  return this.getProducts().pipe(
    map(products => products.find(p => p.id === id)),
    switchMap(product => {
      if (!product) {
        // Fallback: If not found in the cache list, try fetching directly from the API endpoint
        return this.http.get<any>(`${this.apiUrl}/${id}`);
      }
      return of(product);
    }),
    catchError(err => {
      console.error(`Error loading product ID ${id}:`, err);
      return throwError(() => new Error('Product not found'));
    })
  );
}

 getProductsImgsById(ids: number[]): Observable<string[]> {
  return this.getProducts().pipe(
    map(products => {
    
      return products
        .filter(product => ids.includes(product.id))
        .map(product => product.thumbnail); 
    })
  );
}

  updateSearch(query: string) {
    this.searchSubject.next(query);
  }

  // Helper to force clear cache if you ever need to refresh data manually
  clearCache() {
    this.productsCache$ = undefined;
  }
}