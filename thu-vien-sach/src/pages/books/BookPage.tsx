import React, { useEffect, useState } from "react";
import Book from "../../models/book/Book";
import { AxiosResponse } from "axios";
import { Button, Empty, message, Pagination, Popover, Spin } from "antd";
import { handleAPI } from "../../remotes/apiHandle";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import BookCard from "../../components/book/BookCard";
import Search from "antd/es/input/Search";
import FilterComponent from "../../components/FilterComponent";

const BookPage = () => {
  const [isLoading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilterData] = useState({
    maxPrice: 2500000,
    minPrice: 0,
    maxPage: 1000,
    minPage: 1,
  });
  const [selectedFilter, setSelectedFilter] = useState({
    maxPrice: 2500000,
    minPrice: 0,
    maxPage: 1000,
    minPage: 1,
  });

  useEffect(() => {
    getBooks(pageNum);
  }, [pageNum]);

  const getBooks = async (pageNum: number) => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(`books?PageCount&page=1&pageSize=5&sort=Title&order=desc`);
      setBooks(res.data.data);
      setTotal(res.data.total ?? 0);
      console.log(res.data.data)

    } catch (error: any) {
      message.error(error.response?.message || "Error fetching books");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (input: string) => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(`books/search?title=${input}`);
      setBooks(res.data.data);
      setTotal(res.data.total ?? 0);
      setPageNum(1);
    } catch (error: any) {
      message.error(error.response?.message || "Error searching books");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const performFilter = async (filters = selectedFilter) => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(`books/search?minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`);
      setBooks(res.data.data);
      setTotal(res.data.total ?? 0);
      console.log(res.data.data)

    } catch (error: any) {
      message.error(error.response?.message || "Error fetching books");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const resetFilters = () => {
    setSelectedFilter({
      maxPrice: 2500000,
      minPrice: 0,
      maxPage: 1000,
      minPage: 1,
    });
    getBooks(1);
  };

  return isLoading ? (
    <Spin />
  ) : (
    books.length > 0 ? (
      <div className="d-flex flex-column w-75 gap-4 mx-auto">
        <div className="d-flex justify-content-end gap-3 ">
          <Search
            placeholder="Nhập tên sách cần tìm"
            className="w-25"
            allowClear
            enterButton="Tìm kiếm"
            onSearch={performSearch}
          />
          <Popover
            open={openFilter}
            trigger="click"
            onOpenChange={(open) => setOpenFilter(open)}
            content={
              <FilterComponent
                data={{
                  filterData,
                  selectPageRange: (value) =>
                    setSelectedFilter((prev) => ({ ...prev, minPage: value[0], maxPage: value[1] })),
                  selectPriceRange: (value) =>
                    setSelectedFilter((prev) => ({ ...prev, minPrice: value[0], maxPrice: value[1] })),
                  performFilter: () => performFilter(selectedFilter),
                }}
              />
            }
            placement="bottom"
          >
            <Button>Lọc</Button>
          </Popover>
          <Button type="primary" onClick={resetFilters}>
            Tải lại
          </Button>
        </div>

        <div className="container-fluid mt-3">
          <div className="row g-3">
            {books.length > 0 ? (
              books.map((book) => (
                <div className="col-4" key={book.BookID}>
                  <BookCard book={book} />
                </div>
              ))
            ) : (
              <div className="w-100 text-center">
                <p>Không tìm thấy sách phù hợp.</p>
              </div>
            )}
          </div>
          <Pagination
            className="mt-4"
            current={pageNum}
            pageSize={5}
            total={total}
            onChange={(num) => setPageNum(num)}
          />
        </div>
      </div>
    ) : <Empty />
  );
};

export default BookPage;