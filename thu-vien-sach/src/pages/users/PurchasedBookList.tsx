import React, { useEffect, useState } from "react";
import { handleAPI } from "../../remotes/apiHandle";
import { List, Spin } from "antd";
import BookItem from "../../components/book/BookItem";
import Book from "../../models/book/Book";

const PurchasedBookList = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [purchasedBook, setPurchasedBook] = useState<Book[]>([]);

  useEffect(() => {
    getPurchasedBook();
  }, []);

  const getPurchasedBook = async () => {
    try {
      setLoading(true);
      const res = await handleAPI(`order/boughtBooks`);
      setPurchasedBook(res.data.data);
      console.log(res.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return isLoading ? (
    <Spin />
  ) : (
    <List
      bordered
      rowKey={(item) => item.BookID}
      dataSource={purchasedBook}
      renderItem={(item) => (
        <BookItem
          description={item.Description}
          bookId={item.BookID}
          title={item.Title}
          cover_url={item.cover_url}
          action="download"
        />
      )}
    />
  );
};

export default PurchasedBookList;
