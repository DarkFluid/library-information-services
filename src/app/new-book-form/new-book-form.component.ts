import { v4 as uuidv4 } from 'uuid';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'new-book-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: ` <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
    Title <input type="text" formControlName="title" /> <br />
    Author <input type="text" formControlName="author" /> <br />
    Description <input type="text" formControlName="description" /> <br />
    Image
    <input
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      (change)="onFileSelect($event)"
    />
    <br />
    <button type="submit" [disabled]="!bookForm.valid">Add book</button>
  </form>`,
  styles: ``,
})
export class NewBookFormComponent {
  bookForm = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  // async onSubmit() {
  //   const bookId = uuidv4();
  //   fetch(API_URL + '/books', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       title: this.bookForm.value.title,
  //       author: this.bookForm.value.author,
  //       image: this.bookForm.value.image,
  //       id: bookId,
  //     }),
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //   })
  //     .then((response) => {
  //       if (response.status === 201) {
  //         return fetch(API_URL + '/descriptions', {
  //           method: 'POST',
  //           body: JSON.stringify({
  //             id: bookId,
  //             bookId,
  //             description: this.bookForm.value.description,
  //           }),
  //           headers: {
  //             'Content-type': 'application/json; charset=UTF-8',
  //           },
  //         });
  //       }
  //       return null;
  //     })
  //     .catch((error) => console.log(error));
  //   // TODO: add finally for alert
  // }
  onSubmit() {}

  onFileSelect(e: any) {
    const file = e.target.files[0],
      outsideContext = this;
    // Image to Base64 since BE is json-server
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      outsideContext.bookForm.patchValue({ image: reader.result as string });
    };
    // TODO: Create error alert
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
}
