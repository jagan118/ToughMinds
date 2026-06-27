import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../Services/product-service';
import { Router } from '@angular/router';
import { NavBar } from '../nav-bar/nav-bar';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../Services/cart-service';
@Component({
  selector: 'app-home',
  imports: [NavBar, DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  cartService = inject(CartService);
  router = inject(Router);
  productService = inject(ProductService)
  products = signal<any[]>([]);

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productService.updateProducts(data.products);
        this.productService.products$.subscribe(data => {
          this.products.set(data);
        }
        )
      }
    })
  }
  viewProduct(id: number) {
    this.router.navigate(['/productdetails', id]);
  }
  addCart(product: any) {
    this.cartService.addCartItem(product);
    alert('Item added')
    this.router.navigate(['cart']);
  }
}
