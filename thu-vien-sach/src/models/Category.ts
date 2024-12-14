import Book from "./book/Book";

export default interface Category {
  id: number;
  name: string;
  booklist?: {
    coverUrl: string;
    id: number;
    price: number;
    title: string;
    totalPage: number;
  }[];
  books?: number;
}
