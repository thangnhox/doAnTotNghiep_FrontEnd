import { Card, Empty, List, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { handleAPI } from "../../remotes/apiHandle";
import BookItem from "../../components/book/BookItem";

const ReadBookList = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [readBooks, setReadBooks] = useState<
    {
      BookId: number;
      Title: string;
      cover_url: string;
      PageCount: number;
      LastRead: number;
      Progress: number;
    }[]
  >([]);

  useEffect(() => {
    getPurchasedBook();
  }, []);

  const getPurchasedBook = async () => {
    try {
      setLoading(true);
      const res = await handleAPI(`history`);
      setReadBooks(res.data.data);
      console.log(res.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return isLoading ? (
    <Spin />
  ) : readBooks.length === 0 ? (
    <Empty />
  ) : (
    <List
      bordered
      dataSource={readBooks}
      rowKey={(item) => item.BookId}
      renderItem={(item) => (
        <BookItem
          key={item.BookId}
          bookId={item.BookId}
          title={item.Title}
          cover_url={item.cover_url}
          progress={item.Progress}
          total={item.PageCount}
          action="read"
        />
      )}
    />
  );
};

export default ReadBookList;
