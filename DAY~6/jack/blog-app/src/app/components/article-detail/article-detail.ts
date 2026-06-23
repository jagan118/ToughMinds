import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css'
})
export class ArticleDetail implements OnInit {
  // Signals = reactive state (auto-updates UI)
  article = signal<any>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.fetchArticle(id);
    });
  }

  fetchArticle(id: number) {
    
    this.articleService.getArticleById(id).subscribe({
      next: (data) => {
        this.article.set(data);  
        this.loading.set(false);  
      },
      error: (err) => {
        console.error(' Error in fetching article:', err);
        this.loading.set(false);
        alert('Article not found!');
        this.router.navigate(['/articles']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/articles']);
  }
}