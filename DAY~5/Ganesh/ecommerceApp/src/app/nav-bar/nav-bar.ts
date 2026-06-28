import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { CartService } from '../Services/cart-service';
import { ProductService } from '../Services/product-service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { AuthService } from '../Services/auth-service';
@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  cartService = inject(CartService);
  productService = inject(ProductService);
  authService = inject(AuthService);
  searchSubject = new BehaviorSubject<string>('');
  cartCount = 0;

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartCount = items.length;
    });
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(search => this.productService.getProductsBySearchInput(search))
    ).subscribe(products => this.productService.updateProducts(products.products));
  }

  onSearch(searchValue: string) {
    this.searchSubject.next(searchValue);
  }

  logout() {
    this.authService.logout();
  }
}