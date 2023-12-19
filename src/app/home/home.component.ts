import {Component, Input, inject} from '@angular/core';
import {BookData} from '../book-data';
import {BookListComponent} from '../book/book.component';
import {BookService} from '../book.service';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {Sort, MatSortModule} from '@angular/material/sort';
import {BookSortOptions} from '../book-sort-options';
import {MatDialog} from '@angular/material/dialog';
import {Dialog} from '../dialog/dialog.component';
@Component({
  selector: 'home',
  standalone: true,
  template: `<section class="book-list, mat-elevation-z8">
    <table mat-table [dataSource]="bookList" matSort (matSortChange)="onSortChange($event)">
      <ng-container matColumnDef="cover">
        <th mat-header-cell *matHeaderCellDef>Book Cover</th>
        <td mat-cell *matCellDef="let element">
          <img [src]="element.cover" width="40" height="40" />
        </td>
      </ng-container>

      <!-- Title Column -->
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by title">
          Title
        </th>
        <td mat-cell *matCellDef="let element">{{ element.title }}</td>
      </ng-container>

      <!-- Author Column -->
      <ng-container matColumnDef="author">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="Sort by author"
        >
          Author
        </th>
        <td mat-cell *matCellDef="let element">{{ element.author }}</td>
      </ng-container>

      <!-- ISBN Column -->
      <ng-container matColumnDef="isbn">
        <th mat-header-cell *matHeaderCellDef>ISBN</th>
        <td mat-cell *matCellDef="let element">{{ element.isbn }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns" (click)="rowClick(row)"></tr>
    </table>
    <mat-paginator
      [pageSizeOptions]="[5, 10, 15]"
      [length]="paginateData.totalResults"
      [pageSize]="5"
      showFirstLastButtons
      (page)="pageEvent($event)"
      class="paginator"
    >
    </mat-paginator>
  </section> `,
  styles: `
  .book-list {
    max-height: 50%;
  }
  .paginator {
    margin-top: 30px;
  }`,
  imports: [BookListComponent, MatTableModule, MatPaginatorModule, MatSortModule],
})
export class HomeComponent {
  constructor(public dialog: MatDialog) {}

  @Input() searchQuery = '';
  bookList: BookData[] = [];
  paginateData = {
    limit: 5,
    page: 1,
    totalResults: 0,
  };
  bookListSorting: BookSortOptions = {
    sortBy: 'title',
    order: 'asc',
  };
  displayedColumns = ['cover', 'title', 'author', 'isbn'];
  bookService = inject(BookService);

  async updateBookList() {
    if (this.searchQuery) {
      ({bookData: this.bookList, totalResults: this.paginateData.totalResults} =
        await this.bookService.searchBooks(
          this.searchQuery,
          this.paginateData,
          this.bookListSorting
        ));
    } else {
      ({bookData: this.bookList, totalResults: this.paginateData.totalResults} =
        await this.bookService.getBooks(
          {
            page: this.paginateData.page,
            limit: this.paginateData.limit,
          },
          this.bookListSorting
        ));
    }
  }

  ngOnChanges() {
    this.updateBookList();
  }

  setLimit(inputLimit: number) {
    this.paginateData.limit = inputLimit;
    this.updateBookList();
  }

  setPage(inputPage: number) {
    this.paginateData.page = inputPage;
    this.updateBookList();
  }

  pageEvent(pageEvent: PageEvent) {
    this.paginateData.page = pageEvent.pageIndex + 1;
    this.paginateData.limit = pageEvent.pageSize;
    this.updateBookList();
  }

  onSortChange(sortChangeEvent: Sort) {
    console.log(sortChangeEvent);

    this.bookListSorting.sortBy = sortChangeEvent.active as BookSortOptions['sortBy'];
    this.bookListSorting.order = (sortChangeEvent.direction as BookSortOptions['order']) || 'asc';
    this.updateBookList();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, row: any): void {
    this.dialog.open(Dialog, {
      width: '650px',
      height: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        ...row,
      },
    });
  }

  rowClick(row: any) {
    this.openDialog('0ms', '0ms', row);
  }
}
