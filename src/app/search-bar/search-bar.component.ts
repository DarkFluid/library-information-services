import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
const API_URL = 'http://localhost:3000/books';

@Component({
  selector: 'search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="onSubmit()">
      <input type="text" formControlName="searchValue" />
      <input type="radio" formControlName="searchBy" /> Title
      <input type="radio" formControlName="searchBy" /> Author
      <button type="submit" [disabled]="!searchForm.valid">Search</button>
    </form>
    <p>{{ searchForm.value.searchValue }} | {{ searchForm.value.searchBy }}</p>
  `,
  styles: ``,
})
export class SearchBarComponent {
  searchForm = new FormGroup({
    searchValue: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.maxLength(100)])
    ),
    searchBy: new FormControl('title', Validators.required), // TODO: add check only title and author permitted values
  });
  // TODO: fix any type
  @Output() queriedBooks = new EventEmitter<any>();
  async onSubmit() {
    const fetchUrl = `${API_URL}?${this.searchForm.value.searchBy}_like=${this.searchForm.value.searchValue}`; // trusting the validators.required
    const res = await fetch(fetchUrl);
    console.log(await res.json());
    // this.queriedBooks.emit()
  }
}
