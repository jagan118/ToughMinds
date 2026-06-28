import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);
  private cartItemsSubject = new BehaviorSubject<any[]>(this.loadCart());
  cartItems$ = this.cartItemsSubject.asObservable();
  private get currentCart(): any[] {
    return this.cartItemsSubject.value;
  }
  loadCart(): any {
    this.http.get<any>('http://localhost:3000/getCart',
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    ).subscribe(res => {
      this.cartItemsSubject.next(res.items);
    }
    )
  }

  addCartItem(product: any) {
    // const items = this.currentCart;
    // const existingItem = this.cartItemsSubject.value.find(item => item.id == product.id)
    // if (existingItem) {
    //   existingItem.quantity++
    //   this.cartItemsSubject.next([...items]);
    // }
    // else {
    //   this.cartItemsSubject.next([...this.cartItemsSubject.value, { ...product, quantity: 1 }]);
    // }
    // // console.log(this.cartItemsSubject.value);
    // localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
    this.http.post<any>('http://localhost:3000/addcart', product,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    ).subscribe(res => {
      this.loadCart();
    }
    )

  }
  removeItem(id: number) {
    // let items = this.currentCart;
    // const isCartItem = items.find(item => item.id == id);
    // if (isCartItem) {
    //   items = items.filter(item => item.id !== isCartItem.id);
    //   this.cartItemsSubject.next([...items]);
    // }
    console.log("Deleting Item:", id);

    this.http.delete<any>(`http://localhost:3000/deleteCart/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    ).subscribe(res => {
      this.loadCart();
    }
    )
    // console.log("updated cart", this.cartItemsSubject.value);
    // localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }
  UpdateItemQuantity(id: number, delta: number) {
    // let items = this.currentCart;
    // const isCartItem = items.find(item => item.id == id);
    // if (isCartItem.quantity == 1 && delta == -1) {
    //   items = items.filter(item => item.id !== isCartItem.id);
    //   this.cartItemsSubject.next([...items]);
    // }
    // else {
    //   if (delta == 1) {
    //     isCartItem.quantity++;
    //   }
    //   else {
    //     isCartItem.quantity--;
    //   }
    //   this.cartItemsSubject.next([...items]);
    // }
    this.http.put<any>(`http://localhost:3000/updateCart/${id}/${delta}`,{},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    ).subscribe(res => {
      this.loadCart();
    }
    )
    // console.log("updated cart", this.cartItemsSubject.value);
    // localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }
}
