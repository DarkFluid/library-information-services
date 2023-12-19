import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {NewBookFormComponent} from './new-book-form/new-book-form.component';
import {BookListComponent} from './book/book.component';
import {HomeComponent} from './home/home.component';

const API_URL = 'http://localhost:3000';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <section class="wrapper">
      <h1 class="title">Daniel Angelov's Library</h1>
      <hr />
      <search-bar (searchQuery)="onSearch($event)" />
      <new-book-form />
      @defer {
      <home [searchQuery]="searchQuery" />
      } @placeholder { Books will appear here! } @loading { Loading books! }
      <div class="bottom-spacing"></div>
    </section>
  `,
  styles: `
  .wrapper {
    width: 1280px;
    margin: 20px auto;
    text-align:center; // I know this affects the whole website, but I like the current effect
  }
  .bottom-spacing {
    height: 50px;
  }
  .title {
    font-family: 'Rubik Doodle Shadow';
    font-size: 50px;
  }`,
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
