import {Component, Input, inject} from '@angular/core';
import {BookData} from '../book-data';
import {BookListComponent} from '../book/book.component';
import {BookService} from '../book.service';

@Component({
  selector: 'home',
  standalone: true,
  template: `<section class="book-list">
      @for (book of bookList; track book.isbn) {
      <book [bookData]="book" />
      } @empty { No books :< }
    </section>
    <section>
      <span (click)="setLimit(5)" class="button-text">5</span> |
      <span (click)="setLimit(10)" class="button-text">10</span> |
      <span (click)="setLimit(15)" class="button-text">15</span>
      <br />
      <!-- Not happy with how it turned out -->
      @for (item of pages; track $index) { @if(paginateData.page == $index + 1) {
      <span (click)="setPage($index + 1)" class="active-page">{{ $index + 1 }}</span>
      } @else {
      <span (click)="setPage($index + 1)" class="page">{{ $index + 1 }}</span>
      } } @empty { No pages }
    </section>`,

  styles: ``,
  imports: [BookListComponent],
})
export class HomeComponent {
  @Input() searchQuery = '';
  bookList: BookData[] = [];
  paginateData = {
    limit: 5,
    page: 1,
    totalResults: 0,
  };
  pages: any[] = [];
  bookService = inject(BookService);
  async ngOnChanges() {
    this.updateBookList();
  }

  async updateBookList() {
    if (this.searchQuery) {
      ({bookData: this.bookList, totalResults: this.paginateData.totalResults} =
        await this.bookService.searchBooks(this.searchQuery, this.paginateData));
    } else {
      ({bookData: this.bookList, totalResults: this.paginateData.totalResults} =
        await this.bookService.getBooks({
          page: this.paginateData.page,
          limit: this.paginateData.limit,
        }));
    }
    this.pages = Array(Math.ceil(this.paginateData.totalResults / this.paginateData.limit)).fill(0);
  }

  setLimit(inputLimit: number) {
    this.paginateData.limit = inputLimit;
    this.updateBookList();
  }

  setPage(inputPage: number) {
    this.paginateData.page = inputPage;
    this.updateBookList();
  }
}
