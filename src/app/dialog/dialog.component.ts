import {Component, Inject, inject} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {BookData} from '../book-data';
import {BookService} from '../book.service';

@Component({
  selector: 'dialog',
  template: `<div class="layout">
    @defer{
    <div class="image-segment">
      <img [src]="bookData.cover" width="313px" height="499px" />
    </div>
    } @loading { Image is loading }
    <div class="text-segment">
      <h1>{{ bookData.title }}</h1>
      <h3>{{ bookData.author }}</h3>
      <h5><strong>ISBN</strong>: {{ bookData.isbn }}</h5>
      @if (description){
      <p><strong>Description</strong>: {{ description }}</p>
      }
    </div>
  </div>`,
  styles: `
  .layout {
    display: flex;
    gap: 10px;
    margin: auto;
    align-items: center;
  }
  .text-segment{
    width: 313px;
  }`,
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
export class Dialog {
  constructor(@Inject(MAT_DIALOG_DATA) public bookData: BookData) {}

  bookService = inject(BookService);

  description = '';
  async ngOnInit() {
    this.description = await this.bookService.getBookDesription(this.bookData.id);
    console.log(this.description + ' <- desc');
  }
}
