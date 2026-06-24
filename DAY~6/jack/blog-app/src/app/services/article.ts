import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface Article {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private articlesCache$: Observable<Article[]> | null = null;  // ← Cache here

  constructor(private http: HttpClient) {}

  // Fetch ALL articles (cached)
  getArticles(): Observable<Article[]> {
    // If already cached, return cache
    if (!this.articlesCache$) {
      this.articlesCache$ = this.http.get<Article[]>(this.apiUrl).pipe(
        map(articles => 
          articles.map(a => ({
            ...a,
            title: a.title.substring(0, 50)
          }))
        ),
        shareReplay(1)  // ← Cache result, share with all subscribers
      );
    }
    return this.articlesCache$;
  }

  // Fetch ONE article by ID
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  // Search articles
  searchArticles(query: string): Observable<Article[]> {
    return this.getArticles().pipe(
      map(articles => 
        articles.filter(a => 
          a.title.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }
}