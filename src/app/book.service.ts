import {v4 as uuidv4} from 'uuid';
import {Injectable} from '@angular/core';
import {BookData} from './book-data';
import {BookSortOptions} from './book-sort-options';
import {PaginateOptions} from './paginate-options';

export const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor() {}

  async getBooks(
    paginateOptions: PaginateOptions,
    sortOptions: BookSortOptions
  ): Promise<{bookData: BookData[]; totalResults: number}> {
    let endpointUrl = API_URL + `/books?_sort=${sortOptions.sortBy}&_order=${sortOptions.order}`;

    const response = await fetch(
      `${endpointUrl}&_page=${paginateOptions.page}&_limit=${paginateOptions.limit}`
    );
    console.log(response.headers.get('X-Total-Count'));
    return {
      bookData: await response.json(),
      totalResults: Number(response.headers.get('X-Total-Count')),
    };
  }

  async searchBooks(
    endpointUrl: string,
    paginateOptions: PaginateOptions,
    sortingOptions: BookSortOptions = {sortBy: 'title', order: 'asc'}
  ): Promise<{bookData: BookData[]; totalResults: number}> {
    const response = await fetch(
      `${endpointUrl}&_page=${paginateOptions.page}&_limit=${paginateOptions.limit}&_sort=${sortingOptions.sortBy}&_order=${sortingOptions.order}`
    );

    return {
      bookData: await response.json(),
      totalResults: Number(response.headers.get('X-Total-Count')),
    };
  }

  async getBookDesription(bookId: string): Promise<string> {
    const endpointUrl = API_URL + `/descriptions?bookId=${bookId}`;
    const response = await fetch(endpointUrl);
    return (await response.json())[0].description;
  }

  async addBook(data: Omit<BookData, 'id'>, description: string) {
    const bookId = uuidv4();
    return await fetch(API_URL + '/books', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        author: data.author,
        image: data.cover,
        isbn: data.isbn,
        id: bookId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        if (response.status === 201) {
          return fetch(API_URL + '/descriptions', {
            method: 'POST',
            body: JSON.stringify({
              id: bookId,
              bookId,
              description: description,
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });
        }
        return null;
      })
      .catch((error) => console.log(error))
      .finally(() => console.log('finshed upload'));
  }
}
