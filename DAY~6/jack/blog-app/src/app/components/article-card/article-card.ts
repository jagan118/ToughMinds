import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './article-card.html',
  styleUrl: './article-card.css'
})
export class ArticleCard {
  @Input() article: any;  // Parent passes data IN
  @Output() onSelect = new EventEmitter();  // Child sends events OUT

  selectArticle() {
    this.onSelect.emit(this.article);
  }
}