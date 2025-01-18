import { Card, Empty, List, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { handleAPI } from "../../remotes/apiHandle";
import BookItem from "../../components/book/BookItem";

const ReadBookList = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [readBooks, setReadBooks] = useState<
    {
      BookID: number;
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

  return <List
    loading={isLoading}
    bordered
    dataSource={readBooks}
    rowKey={(item) => item.BookID}
    renderItem={(item) => (
      <div className="m-3" >
        <BookItem
          key={item.BookID}
          bookId={item.BookID}
          title={item.Title}
          cover_url={item.cover_url}
          progress={item.Progress}
          total={item.PageCount}
          action="read"
        />
      </div>
    )}
  />
};

export default ReadBookList;
