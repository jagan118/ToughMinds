import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../Services/product-service';
import { NavBar } from '../nav-bar/nav-bar';
import { CartService } from '../Services/cart-service';
@Component({
  selector: 'app-product-details',
  imports: [NavBar],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  router = inject(Router);
  http = inject(HttpClient);
  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  cartService = inject(CartService);

  productData = signal<any>(null);
  ngOnInit() {
    const Id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductDetailsById(Number(Id)).subscribe({
      next: (data) => {
        console.log(data);
        this.productData.set(data);
      }
    })
  }

  updateMainImage(img: string) {
    this.productData.set({
      ...this.productData(),
      thumbnail: img
    });
  }
  goHome() {
    this.router.navigate([''])
  }
  addToBag(product: any) {
    this.cartService.addCartItem(product);
    this.router.navigate(['cart']);
    // alert('Product added to cart!');
  }

}
