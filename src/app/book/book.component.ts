import { Component, Input } from '@angular/core';
import { BookData } from '../book-data';

@Component({
  selector: 'book',
  standalone: true,
  imports: [],
  template: ` <section class="book">
    <img
      class="book-photo"
      [src]="bookData.cover"
      alt="Cover for book &quot;{{ bookData.title }}&quot;"
      width="32"
      height="32"
    />
    <span class="book-text">{{ bookData.title }}</span>
    <span class="book-text">{{ bookData.author }}</span>
    <span class="book-text">{{ bookData.isbn }}</span>
  </section>`,
  styles: ``,
})
export class BookListComponent {
  @Input() bookData!: BookData;
}
