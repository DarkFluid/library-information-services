import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NewBookFormComponent } from './new-book-form/new-book-form.component';
import { BookListComponent } from './book/book.component';
import { HomeComponent } from './home/home.component';

const API_URL = 'http://localhost:3000';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <search-bar (searchQuery)="onSearch($event)" />
    <home [searchQuery]="searchQuery" />
  `,
  styles: ``,
  imports: [
    CommonModule,
    RouterOutlet,
    SearchBarComponent,
    NewBookFormComponent,
    BookListComponent,
    HomeComponent,
  ],
})
export class AppComponent {
  title = 'library-information-services';
  searchQuery = '';
  bookQuery = API_URL + '/books';

  onSearch(queryString: string) {
    this.searchQuery = queryString;
  }
}
