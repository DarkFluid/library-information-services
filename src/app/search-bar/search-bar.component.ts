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
      <input type="radio" formControlName="searchBy" value="title" /> Title
      <input type="radio" formControlName="searchBy" value="author" /> Author
      <button type="submit" [disabled]="!searchForm.valid">Search</button>
    </form>
    @if (this.searchUrl) {
    <button (click)="clearSearch()">Clear Search</button>
    }
  `,
  styles: ``,
})
export class SearchBarComponent {
  searchUrl = '';
  initialValues = {
    searchValue: '',
    searchBy: 'title',
  };
  searchForm = new FormGroup({
    searchValue: new FormControl(
      this.initialValues.searchValue,
      Validators.compose([Validators.required, Validators.maxLength(100)])
    ),
    searchBy: new FormControl(this.initialValues.searchBy, Validators.required),
  });

  @Output() searchQuery = new EventEmitter<string>();

  onSubmit() {
    this.searchUrl = `${API_URL}?${this.searchForm.value.searchBy}_like=${this.searchForm.value.searchValue}`;
    this.searchQuery.emit(this.searchUrl);
  }

  /**
   * Return form to it's intial state
   */
  clearSearch() {
    this.searchUrl = '';
    this.searchForm.reset();
    this.searchForm.patchValue({
      searchValue: this.initialValues.searchValue,
      searchBy: this.initialValues.searchBy,
    });

    this.searchQuery.emit(this.searchUrl);
  }
}
