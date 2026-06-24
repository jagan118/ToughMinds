import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../Services/product-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  router = inject(Router);
  productService = inject(ProductService)
  products = signal<any[]>([]);
  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products.set(data.products);
      }
    })
  }
  viewProduct(id: number) {
    this.router.navigate(['/productdetails', id]);
  }
  addCart()
  {
    alert('Item Added To Cart!')
  }
}
