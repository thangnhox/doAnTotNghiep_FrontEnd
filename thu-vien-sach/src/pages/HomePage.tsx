import React, { useEffect, useState } from "react";
import { handleAPI } from "../remotes/apiHandle";
import { ResponseDTO } from "../dtos/ResponseDTO";
import Book from "../models/book/Book";
import { AxiosResponse } from "axios";
import BookCard from "../components/book/BookCard";
import {
  Card,
  Carousel,
  Divider,
  Image,
  message,
  Spin,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import Category from "../models/Category";
import Author from "../models/Author";

const HomePage = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getBooks = async () => {
    const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(
      `books?page=1&pageSize=10&sort=IsRecommended&order=desc`
    );
    setBooks(res.data.data);
  };

  const getCategories = async () => {
    const res: AxiosResponse<ResponseDTO<Category[]>> = await handleAPI(
      `categories?page=1&pageSize=10&isRecommended=1`
    );
    setCategories(res.data.data);
  };

  const getAuthors = async () => {
    const res: AxiosResponse<ResponseDTO<Author[]>> = await handleAPI(
      `authors?page=1&pageSize=10`
    );
    setAuthors(res.data.data);
  };

  const getData = async () => {
    setLoading(true);
    try {
      getBooks();
      getCategories();
      getAuthors();
    } catch (error: any) {
      console.log(error);
      message.error(error.response.message);
    } finally {
      setLoading(false);
    }
  };

  return isLoading ? (
    <Spin />
  ) : (
    <div className="d-flex flex-column w-100 align-items-center overflow-y ">
      <div className="d-flex flex-column w-75 gap-4">
        <Carousel autoplay autoplaySpeed={5000}>
          <Image src="../images/banner1.png" sizes="100%" preview={false} />
          <Image src="../images/banner2.png" sizes="100%" preview={false} />
          <Image src="../images/banner3.png" sizes="100%" preview={false} />
          <Image src="../images/banner4.png" sizes="100%" preview={false} />
        </Carousel>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <Typography.Title level={3} className="mb-0">
            Nên đọc
          </Typography.Title>
          <Link to="books" className="text-primary">
            Xem thêm
          </Link>
        </div>
        <div className="d-flex flex-row flex-wrap gap-3">
          {books.map((book) => (
            <BookCard book={book} key={book.BookID} />
          ))}
        </div>

        <Divider />

        <div className="d-flex flex-row justify-content-between align-items-center">
          <Typography.Title level={3} className="mb-0">
            Thể loại
          </Typography.Title>
          <Link to="categories" className="text-primary">
            Xem thêm
          </Link>
        </div>
        <div className="d-flex flex-row flex-wrap gap-3">
          {categories.map((cat) => (
            <Card
              onClick={() => {
                console.log(cat.id);
              }}
              key={cat.id}
              hoverable
            >
              {cat.name}
            </Card>
          ))}
        </div>

        <Divider />

        <div className="d-flex flex-row justify-content-between align-items-center">
          <Typography.Title level={3} className="mb-0">
            Tác giả
          </Typography.Title>
          <Link to="authors" className="text-primary">
            Xem thêm
          </Link>
        </div>
        <div className="d-flex flex-row flex-wrap gap-3">
          {authors.map((author) => (
            <Card
              onClick={() => {
                console.log(author.id);
              }}
              key={author.id}
              hoverable
            >
              {author.name}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
