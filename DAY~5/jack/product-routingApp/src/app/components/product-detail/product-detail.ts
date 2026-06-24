import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product';
interface product{
  id:number;
  thumbnail:string;
  title:string;
  price:number;
  description:string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
private productService = inject(ProductService);
  // All products (same as ProductListComponent)
  // products = [
  //   { id: 1, name: 'Laptop', price: 50000, description: 'High performance laptop for gaming and work' },
  //   { id: 2, name: 'Mouse', price: 500, description: 'Wireless mouse with precision control' },
  //   { id: 3, name: 'Keyboard', price: 2000, description: 'Mechanical keyboard with RGB lights' },
  //   { id: 4, name: 'Monitor', price: 15000, description: '4K display monitor' },
  //   { id: 5, name: 'Headphones', price: 3000, description: 'Noise cancelling headphones' },
  //   { id: 6, name: 'USB Cable', price: 200, description: 'High speed USB 3.0 cable' },
  //   { id: 7, name: 'Webcam', price: 2500, description: '1080p HD webcam for streaming' },
  //   { id: 8, name: 'Desk Lamp', price: 1500, description: 'LED desk lamp with adjustable brightness' },
  //   { id: 9, name: 'Phone Stand', price: 800, description: 'Adjustable phone stand' },
  //   { id: 10, name: 'External HDD', price: 5000, description: '2TB external hard drive' },
  //   { id: 11, name: 'SSD', price: 8000, description: '500GB NVMe SSD' },
  //   { id: 12, name: 'RAM 16GB', price: 6000, description: 'DDR4 16GB RAM kit' },
  //   { id: 13, name: 'Graphics Card', price: 30000, description: 'RTX 3060 graphics card' },
  //   { id: 14, name: 'Power Supply', price: 4000, description: '800W modular power supply' },
  //   { id: 15, name: 'CPU Cooler', price: 3500, description: 'Tower CPU cooler with RGB' },
  //   { id: 16, name: 'Motherboard', price: 12000, description: 'B550 chipset motherboard' },
  //   { id: 17, name: 'Case', price: 5000, description: 'ATX gaming case with tempered glass' },
  //   { id: 18, name: 'WiFi Router', price: 3000, description: 'Dual band WiFi 6 router' },
  //   { id: 19, name: 'USB Hub', price: 1200, description: '7-port USB hub' },
  //   { id: 20, name: 'Cable Organizer', price: 600, description: 'Cable management organizer' },
  //   { id: 21, name: 'Screen Protector', price: 300, description: 'Tempered glass screen protector' },
  //   { id: 22, name: 'Cooling Pad', price: 1800, description: 'Laptop cooling pad with fans' },
  //   { id: 23, name: 'HDMI Cable', price: 400, description: '2K HDMI cable' },
  //   { id: 24, name: 'Portable Charger', price: 2000, description: '20000mAh portable charger' },
  //   { id: 25, name: 'Tablet', price: 20000, description: '10-inch display tablet' }
  // ];
  product = signal<product | null> (null);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Grab the :id from the URL
    this.route.params.subscribe(params => {
      const productId = params['id'];
      // Find the product with this ID
      this.productService.getProductById(productId).subscribe({
        next:(data:product)=>{
          this.product.set(data);
        },
        error:(err)=>{
          console.log("failed in getting product"+err);
          
        }
      });
    });
  }

  // Go back to products list
  goBack() {
    this.router.navigate(['/products']);
  }
}