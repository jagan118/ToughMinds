import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.services';
import {ProductService} from '../../services/product'


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  public cartService = inject(CartService)
  public productService = inject(ProductService)
  cartItems = this.cartService.cart$;
  cartSubject = this.cartService.cart;
  

getImages() {
  // 1. Extract the product IDs currently in the cart
  const productIds = this.cartItems().map(item => item.id);
  
  if (productIds.length === 0) return;

  // 2. Fetch the images from the service
  this.productService.getProductsImgsById(productIds).subscribe({
    next: (thumbnails) => {
      // 3. Map over your current cart items and attach the matching thumbnail by index
      const updatedCart = this.cartItems().map((item, index) => {
        return {
          ...item,
          thumbnail: thumbnails[index] // Matches the image with the product ID order
        };
      });

      // 4. Update your cart state (assuming cartItems is a writable signal or BehaviorSubject)
      // If it's a Signal:
      this.cartService.updateCart(updatedCart);
      
      // If it's a BehaviorSubject, use: this.cartItems.next(updatedCart);
    },
    error: (err) => console.error('Failed to update cart thumbnails:', err)
  });
}
constructor(){
  this.getImages()
}  

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  increaseQty(id: number) {
    this.cartService.increaseQuantity(id);
  }

  decreaseQty(id: number) {
    this.cartService.decreaseQuantity(id);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  clearCart() {
    if (confirm('Clear entire cart?')) {
      this.cartService.clearCart();
    }
  }

  checkout() {
    alert('Proceeding to checkout...');
    // In real app, send to payment gateway
  }
}