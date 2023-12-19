import {Component, EventEmitter, Output} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {API_URL} from '../book.service';

@Component({
  selector: 'search-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
  ],
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="onSubmit()" class="search-form">
      <mat-form-field class="search-field">
        <mat-label>Search the library</mat-label>
        <input matInput formControlName="searchValue" placeholder="Hans..." value="" />
      </mat-form-field>

      <mat-radio-group formControlName="searchBy" aria-label="Select an option">
        <mat-radio-button value="title">Title</mat-radio-button>
        <mat-radio-button value="author">Author</mat-radio-button>
      </mat-radio-group>
      <!-- The disabled check is so we don't get an error when the field is empty/cleared -->
      <button
        mat-raised-button
        color="primary"
        [disabled]="!(searchForm.value.searchValue!.length > 0)"
      >
        Search
      </button>
      @if (this.searchUrl) {
      <button mat-button (click)="clearSearch()">Clear Search</button>
      }
    </form>
  `,
  styles: `
  .search-form {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    width: 75%;
    align-items: baseline;
    gap: 10px;
    margin: 30px auto;
    .search-field {
      width: 60%;
    }
  }`,
})
export class SearchBarComponent {
  searchUrl = '';
  initialValues = {
    searchValue: '',
    searchBy: 'title',
  };
  searchForm = new FormGroup({
    searchValue: new FormControl(this.initialValues.searchValue, Validators.maxLength(100)),
    searchBy: new FormControl(this.initialValues.searchBy, Validators.required),
  });

  @Output() searchQuery = new EventEmitter<string>();

  onSubmit() {
    this.searchUrl = `${API_URL}/books?${this.searchForm.value.searchBy}_like=${this.searchForm.value.searchValue}`;
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
