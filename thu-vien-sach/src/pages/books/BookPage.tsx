import React, { useEffect, useState } from "react";
import Book from "../../models/book/Book";
import { AxiosResponse } from "axios";
import { Button, message, Pagination, Spin } from "antd";
import { handleAPI } from "../../remotes/apiHandle";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import BookCard from "../../components/book/BookCard";
import Search from "antd/es/input/Search";

const BookPage = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);

  useEffect(() => {
    getBooks(pageNum);
  }, [pageNum]);

  const getBooks = async (pageNum: number) => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(
        `books?page=${pageNum}&pageSize=5&sort=Title&order=desc`
      );
      setBooks(res.data.data);
      setTotal(res.data.total ?? 0);
    } catch (error: any) {
      message.error(error.response.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (input: string) => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(
        `books/search?title=${input}`
      );
      setBooks(res.data.data);
      setTotal(res.data.total ?? 0);
      setPageNum(1);
    } catch (error: any) {
      message.error(error.response.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return isLoading ? (
    <Spin />
  ) : (
    <div className="d-flex flex-column w-75 gap-4 mx-auto">
      <div className="d-flex justify-content-end gap-3 ">
        <Search
          placeholder="Nhập tên sách cần tìm"
          className="w-25"
          allowClear
          enterButton="Tìm kiếm"
          onSearch={performSearch}
        />
        <Button type="primary" onClick={() => getBooks(pageNum)} >Tải lại</Button>
      </div>

      <div className="container-fluid mt-3 ">
        <div className="row g-3">
          {books.map((book) => (
            <div className="col-4" key={book.BookID}>
              <BookCard book={book} />
            </div>
          ))}
          <Pagination current={pageNum} pageSize={10} total={total} onChange={(num, _) => setPageNum(num)} />
        </div>
      </div>
    </div>
  );
};

export default BookPage;
