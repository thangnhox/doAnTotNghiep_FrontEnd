import { useCallback, useEffect, useState } from "react";
import Book from "../../models/book/Book";
import { AxiosResponse } from "axios";
import { Button, Input, InputNumber, message, Pagination, Spin } from "antd";
import { handleAPI } from "../../remotes/apiHandle";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import BookCard from "../../components/book/BookCard";

interface FilterState {
  maxPrice: number | undefined;
  minPrice: number | undefined;
  maxPage: number | undefined;
  minPage: number | undefined;
  enablePagePrice: boolean | undefined;
  exact: boolean | undefined;
  bookName: string | undefined;
  authorName: string | undefined;
  category: string | undefined;
  publisherName: string | undefined;
}

const BookPage = () => {
  const [isLoading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [filterMode, setFilterMode] = useState(false);
  const [filterData] = useState({
    maxPrice: 2500000,
    minPrice: 0,
    maxPage: 1000,
    minPage: 1,
  });
  const [selectedFilter, setSelectedFilter] = useState<FilterState>({
    maxPrice: 2500000,
    minPrice: 0,
    maxPage: 1000,
    minPage: 1,
    enablePagePrice: true,
    exact: false,
    bookName: "",
    authorName: "",
    category: "",
    publisherName: "",
  });

  const performFilter = useCallback(
    async (filters: FilterState, curMode: boolean, page: number) => {
      console.log(filters);
      try {
        setLoading(true);

        let url: String = `books/search?pageSize=5&page=${page}`;

        let valid: boolean = false;

        if (filters.enablePagePrice) {
          const minPrice =
            filters.minPrice !== undefined ? Math.floor(filters.minPrice) : filterData.minPrice;
          const maxPrice =
            filters.maxPrice !== undefined ? Math.floor(filters.maxPrice) : filterData.maxPrice;
          const minPage = filters.minPage !== undefined ? Math.floor(filters.minPage) : filterData.minPage;
          const maxPage = filters.maxPage !== undefined ? Math.floor(filters.maxPage) : filterData.maxPage;

          url += `&minPrice=${minPrice}&maxPrice=${maxPrice}&minPage=${minPage}&maxPage=${maxPage}`;
          valid = true;
        }

        if (filters.exact) {
          url += "&exact=true";
        }

        if (filters.bookName && filters.bookName.trim() !== "") {
          url += `&title=${filters.bookName}`;
          valid = true;
        }

        if (filters.authorName && filters.authorName.trim() !== "") {
          url += `&authorName=${filters.authorName}`;
          valid = true;
        }

        if (filters.category && filters.category.trim() !== "") {
          url += `&category=${filters.category}`;
          valid = true;
        }

        if (filters.publisherName && filters.publisherName.trim() !== "") {
          url += `&publisherName=${filters.publisherName}`;
          valid = true;
        }

        if (!valid) {
          message.error("Vui lòng nhập ít nhất một điều kiện lọc.");
          return;
        }

        const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(
          url.toString()
        );
        setBooks(res.data.data);
        setTotal(res.data.total ?? 0);

        if (!filterMode) {
          setPageNum(1); // Reset page to 1 after filtering
          setFilterMode(true);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setBooks([]);
          setTotal(0);
        }
        message.error(error.response?.message || "Error fetching books");
      } finally {
        setLoading(false);
      }
    },
    [filterData, filterMode]
  );

  useEffect(() => {
    if (!filterMode) {
      getBooks(pageNum);
    } else {
      performFilter(selectedFilter, filterMode, pageNum);
    }
  }, [pageNum, filterMode, selectedFilter, performFilter]);

  const getBooks = async (pageNum: number) => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(
        `books?page=${pageNum}&pageSize=5&sort=Title&order=desc`
      );
      setBooks(res.data.data);
      setTotal(res.data.total ?? 0);
    } catch (error: any) {
      message.error(error.response?.message || "Error fetching books");
    } finally {
      setLoading(false);
    }
  };

  // const performSearch = async (input: string) => {
  //   try {
  //     setLoading(true);
  //     const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(
  //       `books/search?title=${input}&page=1&pageSize=5`
  //     );
  //     setBooks(res.data.data);
  //     setTotal(res.data.total ?? 0);
  //     setPageNum(1);
  //   } catch (error: any) {
  //     message.error(error.response?.message || "Error searching books");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  
  const resetFilters = () => {
    const defaultFilter = {
      maxPrice: 2500000,
      minPrice: 0,
      maxPage: 1000,
      minPage: 1,
      enablePagePrice: true,
      exact: false,
      bookName: "",
      authorName: "",
      category: "",
      publisherName: "",
    };
    setFilterMode(false);
    setSelectedFilter(defaultFilter);
    performFilter(defaultFilter, filterMode, pageNum);
  };

  const handleInputChange = (name: keyof FilterState, value: number | undefined) => {
    setSelectedFilter((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (<Spin />);
  }

  return (
    <div className="d-flex flex-column w-75 gap-4 mx-auto">
      <div className="border p-3 rounded">
        <h4>Lọc Nâng Cao</h4>
        <div className="d-flex gap-3 align-items-center mb-2">
          <label htmlFor="minPrice">Giá từ (VND):</label>
          <InputNumber
            id="minPrice"
            style={{ width: 150 }}
            value={selectedFilter.minPrice}
            onChange={(value) => handleInputChange("minPrice", value ? value : filterData.minPrice)}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => Number(value!.replace(/,/g, ""))}
          />
          <label htmlFor="maxPrice">đến (VND):</label>
          <InputNumber
            id="maxPrice"
            style={{ width: 150 }}
            value={selectedFilter.maxPrice}
            onChange={(value) => handleInputChange("maxPrice", value ? value : filterData.maxPrice)}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => Number(value!.replace(/,/g, ""))}
          />
          <label htmlFor="minPage">Số trang từ:</label>
          <InputNumber
            id="minPage"
            style={{ width: 100 }}
            value={selectedFilter.minPage}
            onChange={(value) => handleInputChange("minPage", value ? value : filterData.minPage)}
          />
          <label htmlFor="maxPage">đến:</label>
          <InputNumber
            id="maxPage"
            style={{ width: 100 }}
            value={selectedFilter.maxPage}
            onChange={(value) => handleInputChange("maxPage", value ? value : filterData.maxPage)}
          />
          <input
            type="checkbox"
            id="enablePagePrice"
            checked={selectedFilter.enablePagePrice || false}
            onChange={(e) =>
              setSelectedFilter((prev) => ({ ...prev, enablePagePrice: e.target.checked }))
            }
          />
          <label htmlFor="enablePagePrice">Áp dụng hàng này</label>
        </div>
        <div className="d-flex gap-3 align-items-center mb-2">
          <label htmlFor="bookName">Tên sách:</label>
          <Input
            id="bookName"
            style={{ width: 300 }}
            value={selectedFilter.bookName || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only letters, numbers, and spaces
              if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                setSelectedFilter((prev) => ({ ...prev, bookName: value }));
              } else {
                message.error("Tên sách không được chứa ký tự đặc biệt!");
              }
            }}
            placeholder="Nhập tên sách"
          />
          <label htmlFor="category">Thể loại:</label>
          <Input
            id="category"
            style={{ width: 300 }}
            value={selectedFilter.category || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only letters, numbers, and spaces
              if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                setSelectedFilter((prev) => ({ ...prev, category: value }));
              } else {
                message.error("Thể loại không được chứa ký tự đặc biệt!");
              }
            }}
            placeholder="Nhập thể loại"
          />
        </div>
        <div className="d-flex gap-3 align-items-center mb-2">
          <label htmlFor="authorName">Tên tác giả:</label>
          <Input
            id="authorName"
            style={{ width: 300 }}
            value={selectedFilter.authorName || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only letters, numbers, and spaces
              if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                setSelectedFilter((prev) => ({ ...prev, authorName: value }));
              } else {
                message.error("Tên tác giả không được chứa ký tự đặc biệt!");
              }
            }}
            placeholder="Nhập tên tác giả"
          />
          <label htmlFor="publisherName">Nhà xuất bản:</label>
          <Input
            id="publisherName"
            style={{ width: 300 }}
            value={selectedFilter.publisherName || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only letters, numbers, and spaces
              if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                setSelectedFilter((prev) => ({ ...prev, publisherName: value }));
              } else {
                message.error("Nhà xuất bản không được chứa ký tự đặc biệt!");
              }
            }}
            placeholder="Nhập nhà xuất bản"
          />
        </div>
        <div className="d-flex gap-3 align-items-center mb-2">
          <input
            type="checkbox"
            id="exact"
            checked={selectedFilter.exact || false}
            onChange={(e) =>
              setSelectedFilter((prev) => ({ ...prev, exact: e.target.checked }))
            }
          />
          <label htmlFor="exact">Tìm chính xác</label>
        </div>
        <Button type="primary" onClick={() => performFilter(selectedFilter, filterMode, pageNum)}>
          Áp dụng Lọc
        </Button>
        <Button className="ms-2" onClick={resetFilters}>
          Đặt lại Lọc
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
  );
};

export default BookPage;