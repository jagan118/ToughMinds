import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-article.html',
  styleUrl: './add-article.css'
})
export class AddArticle {
  articleForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router) {
    // Simpler form setup - avoid async validator issues
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(20)]],
      userId: ['1', Validators.required]  // Default value, not async
    });
  }

  get title() { 
    return this.articleForm.get('title'); 
  }

  get body() { 
    return this.articleForm.get('body'); 
  }

  get userId() { 
    return this.articleForm.get('userId'); 
  }

  onSubmit() {
    this.submitted = true;

    if (this.articleForm.valid) {
      const newArticle = this.articleForm.value;
      console.log('Saving article:', newArticle);
      alert('Article saved successfully!');
      this.articleForm.reset();
      this.submitted = false;
      this.router.navigate(['/admin']);
    }
  }
}