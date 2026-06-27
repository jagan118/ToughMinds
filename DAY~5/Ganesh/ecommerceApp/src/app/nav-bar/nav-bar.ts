import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../Services/cart-service';
import { ProductService } from '../Services/product-service';
import { of } from 'rxjs';
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  cartService = inject(CartService);
  productService = inject(ProductService)
  searchSubject = new BehaviorSubject<string>('');
  cartCount = 0;
  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartCount = items.length;
    });
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(search => {
        return this.productService.getProductsBySearchInput(search)
      }
      )
    ).subscribe(products => this.productService.updateProducts(products.products))
  }
  onSearch(searchValue: string) {
    this.searchSubject.next(searchValue);
  }
}