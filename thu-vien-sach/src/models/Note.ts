export interface Note {
  id?: number;
  booksId: number;
  page?: number | null;
  userId?: string;
  detail: string;
}
