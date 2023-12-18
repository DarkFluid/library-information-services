import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NewBookFormComponent } from './new-book-form/new-book-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SearchBarComponent,
    NewBookFormComponent,
  ],
  template: ` <search-bar></search-bar>
    <new-book-form></new-book-form>`,
  styles: ``,
})
export class AppComponent {
  title = 'library-information-services';
}
