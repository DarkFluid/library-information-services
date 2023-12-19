import {Injectable} from '@angular/core';
import {BookData} from './book-data';
import {BookSortOptions} from './book-sort-options';
import {PaginateOptions} from './paginate-options';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor() {}

  async getBooks(
    paginateOptions: PaginateOptions,
    sortOptions?: BookSortOptions
  ): Promise<{bookData: BookData[]; totalResults: number}> {
    let endpointUrl = API_URL + '/books';
    if (sortOptions) {
      endpointUrl = `${endpointUrl}?_sort=${sortOptions.sortBy}&_order=${sortOptions.order}`;
    }

    const response = await fetch(
      `${endpointUrl}?_page=${paginateOptions.page}&_limit=${paginateOptions.limit}`
    );
    console.log(response.headers.get('X-Total-Count'));
    return {
      bookData: await response.json(),
      totalResults: Number(response.headers.get('X-Total-Count')),
    };
  }

  async searchBooks(
    endpointUrl: string,
    paginateOptions: PaginateOptions
  ): Promise<{bookData: BookData[]; totalResults: number}> {
    console.log(endpointUrl);

    const response = await fetch(
      `${endpointUrl}&_page=${paginateOptions.page}&_limit=${paginateOptions.limit}`
    );

    return {
      bookData: await response.json(),
      totalResults: Number(response.headers.get('X-Total-Count')),
    };
  }

  async getBookDesription(bookId: string) {
    const endpointUrl = API_URL + '/descriptions';
  }
}
