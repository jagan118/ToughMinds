import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { signal, Signal } from '@angular/core';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  // Signal for reactive updates
  private cartSignal = signal<CartItem[]>([]);
  public cart$: Signal<CartItem[]> = this.cartSignal.asReadonly();

  // BehaviorSubject for observable subscribers
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Load from localStorage on init
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        this.cartSignal.set(items);
        this.cartSubject.next(items);
      }
    }
  }

  // Add item to cart
  addToCart(product: any) {
    const currentCart = this.cartSignal();
    const existingItem = currentCart.find(item => item.id === product.id);

    let updatedCart: CartItem[];

    if (existingItem) {
      // Item exists, increase quantity
      updatedCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // New item
      updatedCart = [
        ...currentCart,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1
        }
      ];
    }

    this.updateCart(updatedCart);
  }

  // Increase quantity
  increaseQuantity(productId: number) {
    const updatedCart = this.cartSignal().map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    this.updateCart(updatedCart);
  }

  // Decrease quantity
  decreaseQuantity(productId: number) {
    let updatedCart = this.cartSignal().map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
        : item
    );

    // Remove if quantity = 0
    updatedCart = updatedCart.filter(item => item.quantity > 0);
    this.updateCart(updatedCart);
  }

  // Remove item
  removeFromCart(productId: number) {
    const updatedCart = this.cartSignal().filter(item => item.id !== productId);
    this.updateCart(updatedCart);
  }

  // Clear cart
  clearCart() {
    this.updateCart([]);
  }

  // Get total items
  getTotalItems(): number {
    return this.cartSignal().reduce((sum, item) => sum + item.quantity, 0);
  }

  // Get total price
  getTotalPrice(): number {
    return this.cartSignal().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  // Private: Update cart everywhere
  public updateCart(items: CartItem[]) {
    this.cartSignal.set(items);
    this.cartSubject.next(items);

    // Persist to localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }
}