import Book from "./book/Book";

export default interface Category {
  id: number;
  name: string;
  booklist?: {
    cover_url: string;
    BookID: number;
    Price: number;
    Title: string;
    PageCount: number;
  }[];
  books?: number;
}
