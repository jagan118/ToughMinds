import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article';
import { ArticleCard } from '../article-card/article-card';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ArticleCard],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css'
})
export class ArticleList implements OnInit {
  articles = signal<any[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        console.log(' Articles :', data);
        this.articles.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load articles');
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    if (this.searchTerm().trim()) {
      this.articleService.searchArticles(this.searchTerm()).subscribe(
        data => this.articles.set(data)
      );
    } else {
      this.loadArticles();
    }
  }

  trackByArticleId(index: number, article: any) {
    return article.id;
  }

  onArticleSelect(article: any) {
    console.log('Selected:', article);
  }
}