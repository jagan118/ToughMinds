import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../Services/product-service';
@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  router = inject(Router);
  http = inject(HttpClient);
  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  productData= signal<any>({});
  ngOnInit() {
    const Id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductDetailsById(Number(Id)).subscribe({
      next: (data) => {
        console.log(data);
        this.productData.set(data);
      }
    })
  }
  goHome()
  {
    this.router.navigate([''])
  }

}
