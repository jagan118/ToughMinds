import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProductComponent implements OnInit {
  editForm!: FormGroup;
  submitted = false;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadProduct();
  }

  initForm() {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });
  }

  loadProduct() {
    const id = this.route.snapshot.params['id'];
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.editForm.patchValue({
          title: data.title,
          price: data.price,
          description: data.description
        });
        this.loading = false;
      },
      error: () => {
        alert('Product not found');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.valid) {
      console.log('Saving:', this.editForm.value);
      alert('Product updated!');
      this.router.navigate(['/admin']);
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}