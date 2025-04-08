import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Author from "../../models/Author";
import Book from "../../models/book/Book";
import { handleAPI } from "../../remotes/apiHandle";
import { Card, Divider, Empty, Image, Spin, Typography } from "antd";
import BookCard from "../../components/book/BookCard";
import { reFormatToDDMMYY } from "../../utils/datetimeUtil";
import { AppConstants } from "../../appConstants";

interface PageState {
  author: Author | null;
  books: Book[];
  isLoading: boolean;
}

const AuthorDetailPage = () => {
  const { authorId } = useParams();
  const [pageState, setPageState] = useState<PageState>({
    author: null,
    books: [],
    isLoading: false,
  });

  const getAuthor = useCallback(async () => {
    try {
      setPageState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      const res = await handleAPI(`authors/info/${authorId}`);
      setPageState((prev) => ({
        ...prev,
        books: res.data.data.books.list.map((item: any) => ({
          BookID: item.BookID,
          Title: item.title,
          Price: item.price,
          cover_url: item.coverUrl,
          PageCount: item.pageCount,
          Description: item.description,
        })),
        author: res.data.data.author,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setPageState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [authorId]);

  useEffect(() => {
    getAuthor();
  }, [getAuthor]);

  return pageState.isLoading ? (
    <Spin />
  ) : (
    <div className="d-flex flex-column gap-3 text-start ">
      <div className="container">
        <div className="row">
          <div className="col-6">
            <div className="d-flex justify-content-center align-items-center">
              <Card>
                <Image
                  preview={false}
                  src={
                    pageState.author?.avatar ||
                    AppConstants.images.defaultAvatar
                  }
                  width={500}
                  alt="Author's Image"
                  style={{ borderRadius: "8px" }}
                />
              </Card>
            </div>
          </div>
          <div className="col-6">
            <Card>
              <div className="d-flex flex-column text-start">
                <Typography.Title level={4}>
                  {pageState.author?.name ?? "N/a"}
                </Typography.Title>
                <Divider />
                <span>
                  <strong>Ngày sinh: </strong>
                  <Typography.Text>
                    {reFormatToDDMMYY(pageState.author?.birthDate)}
                  </Typography.Text>
                </span>
                <Divider />
                <span>
                  <strong>Quốc gia: </strong>
                  <Typography.Text>
                    {pageState.author?.nationality}
                  </Typography.Text>
                </span>

                <Divider />
                <span>
                  <strong>Mô tả: </strong>
                  <Typography.Text>
                    {pageState.author?.description}
                  </Typography.Text>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Divider />
      <Card>
        <Typography.Title level={2}>Sách của tác giả</Typography.Title>
        <Divider />
        {pageState.books.length === 0 ? (
          <Empty />
        ) : (
          pageState.books.map((item) => <BookCard book={item} />)
        )}
      </Card>
    </div>
  );
};

export default AuthorDetailPage;
