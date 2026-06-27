import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../Services/cart-service';
import { RouterLink } from '@angular/router';
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBar],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);
  cartItems = signal<any[]>([]);

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      console.log('Cart items updated:', items);
      this.cartItems.set(items);
    });
  }

  get subtotal() {
    return this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get tax() {
    return this.subtotal * 0.08;
  }

  get total() {
    return this.subtotal + this.tax + 10; // $10 shipping
  }

  removeItem(id: number) {
   this.cartService.removeItem(id);
  }

  updateQuantity(id: number, delta: number) {
    this.cartService.UpdateItemQuantity(id, delta)
  }
}
