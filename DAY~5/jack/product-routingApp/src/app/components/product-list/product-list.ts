import { Component,inject,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product';

interface product{
  id:number;
  title:string;
  price:number;
  description:string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent {

  // 1. Dependency Injection: Fetch your API data service from the injector
private productService = inject(ProductService);

// 2. Modern Signal State: Create a writable signal to hold the products list array
products = signal<product[]>([]);
isLoading = signal<boolean>(true);

  // Hardcoded 25 products
  // products = [
  //   { id: 1, name: 'Laptop', price: 50000 },
  //   { id: 2, name: 'Mouse', price: 500 },
  //   { id: 3, name: 'Keyboard', price: 2000 },
  //   { id: 4, name: 'Monitor', price: 15000 },
  //   { id: 5, name: 'Headphones', price: 3000 },
  //   { id: 6, name: 'USB Cable', price: 200 },
  //   { id: 7, name: 'Webcam', price: 2500 },
  //   { id: 8, name: 'Desk Lamp', price: 1500 },
  //   { id: 9, name: 'Phone Stand', price: 800 },
  //   { id: 10, name: 'External HDD', price: 5000 },
  //   { id: 11, name: 'SSD', price: 8000 },
  //   { id: 12, name: 'RAM 16GB', price: 6000 },
  //   { id: 13, name: 'Graphics Card', price: 30000 },
  //   { id: 14, name: 'Power Supply', price: 4000 },
  //   { id: 15, name: 'CPU Cooler', price: 3500 },
  //   { id: 16, name: 'Motherboard', price: 12000 },
  //   { id: 17, name: 'Case', price: 5000 },
  //   { id: 18, name: 'WiFi Router', price: 3000 },
  //   { id: 19, name: 'USB Hub', price: 1200 },
  //   { id: 20, name: 'Cable Organizer', price: 600 },
  //   { id: 21, name: 'Screen Protector', price: 300 },
  //   { id: 22, name: 'Cooling Pad', price: 1800 },
  //   { id: 23, name: 'HDMI Cable', price: 400 },
  //   { id: 24, name: 'Portable Charger', price: 2000 },
  //   { id: 25, name: 'Tablet', price: 20000 }
  // ];


  ngOnInit(): void {
    // 3. Asynchronous Execution: Subscribe to the API Observable stream
    this.productService.getProducts().subscribe({
      next: (data: product[]) => {
        // Update the writable signals with incoming data payloads
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('API Stream processing encountered an exception:', err);
        this.isLoading.set(false);
      }
    });
  }


  constructor(private router: Router) {}

  // When user clicks on a product
  viewProduct(id: number) {
    this.router.navigate(['/products', id]);
  }
}