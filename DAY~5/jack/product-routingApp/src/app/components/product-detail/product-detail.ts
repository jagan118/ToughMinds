import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart.services';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, HasRoleDirective],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetail implements OnInit {
  product = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadProduct(id);
    });
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(`Error: ${err.message}`);
        this.loading.set(false);
      }
    });
  }

  addToCart() {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product);
      alert('Added to cart!');
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}