export interface ResponseDTO<T> {
  data: T;
  message: string;
  total?: number;
  page?: number;
  pageSize?: number;
}
