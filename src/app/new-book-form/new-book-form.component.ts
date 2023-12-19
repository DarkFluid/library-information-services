import {Component, inject} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {BookService} from '../book.service';

@Component({
  selector: 'new-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule],

  template: ` <section class="add-book-section">
    <button mat-raised-button (click)="toggleBookForm()">
      {{ showBookForm ? 'Hide book form' : 'Show book form' }}
    </button>
    @if (showBookForm) {
    <div class="mat-elevation-z8 form-container">
      <form [formGroup]="bookForm" (ngSubmit)="onSubmit()" class="book-form">
        <mat-form-field class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Beloved" value="" />
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Author</mat-label>
          <input matInput formControlName="author" placeholder="Toni Morrison" value="" />
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>ISBN</mat-label>
          <input matInput formControlName="isbn" placeholder="9780330305372" value="" />
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="" value=""></textarea>
        </mat-form-field>
        Image
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          (change)="onFileSelect($event)"
        />
        <br />
        <button mat-raised-button color="primary" type="submit" [disabled]="!bookForm.valid">
          Add book
        </button>
      </form>
      <div class="img-preview">
        <img [src]="bookForm.value.image" width="319px" height="499px" />
      </div>
    </div>
    }
  </section>`,
  styles: `
  .add-book-section {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .book-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
  }
  .full-width {
    width: 100%;
  }
  .form-container {
    margin-top: 20px;
    padding: 20px;
    display:flex;
  }
  .img-preview {
    width: 50%;
  }`,
})
export class NewBookFormComponent {
  bookService = inject(BookService);
  formInitialValues = {
    title: '',
    author: '',
    isbn: '',
    image: '',
    description: '',
  };
  bookForm = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    isbn: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/^978|9?\d{9}\d|X$/gm)])
    ),
    image: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  showBookForm = false;

  async onSubmit() {
    const response = await this.bookService.addBook(
      {
        // Using non-null assertion everywhere since I trust the validators and default values
        title: this.bookForm.value.title!,
        author: this.bookForm.value.author!,
        cover: this.bookForm.value.image!,
        isbn: this.bookForm.value.isbn!,
      },
      this.bookForm.value.description!
    );
    if (response?.ok) {
      this.bookForm.reset();
      this.showBookForm = false;
    }
  }

  toggleBookForm() {
    this.showBookForm = !this.showBookForm;
  }

  onFileSelect(e: any) {
    const file = e.target.files[0],
      outsideContext = this;
    // Image to Base64 since BE is json-server
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      outsideContext.bookForm.patchValue({image: reader.result as string});
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
}
