import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { HighlightDirective } from '../../directives/highlight.directive';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.services';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HighlightDirective,
    HasRoleDirective,
    RouterLink
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush  // Performance optimization
})
export class ProductList implements OnInit {
  products = signal<any[]>([]);
  searchQuery = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private productService: ProductService,
    public authService: AuthService,
    public cartService:CartService
  ) {}

  ngOnInit() {
    // Load products
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });

    // Search with debounce + switchMap
    this.productService.getSearchResults().subscribe(data => {
      this.products.set(data);
    });
  }

  onSearch() {
    this.productService.updateSearch(this.searchQuery());
  }

  // TrackBy = optimization (tell Angular which items changed)
  trackByProductId(index: number, product: any) {
    return product.id;
  }

  addToCart(product: any) {
  this.cartService.addToCart(product);
  alert('Added to cart!');
}
}