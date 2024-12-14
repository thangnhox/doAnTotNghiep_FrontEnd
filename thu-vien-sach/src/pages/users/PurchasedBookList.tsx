import React, { useEffect, useState } from "react";
import { handleAPI } from "../../remotes/apiHandle";
import { List, Spin } from "antd";
import BookItem from "../../components/book/BookItem";

const PurchasedBookList = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [purchasedBook, setPurchasedBook] = useState<
    {
      bookId: number;
      title: string;
      cover_url: string;
      description: string;
    }[]
  >([]);

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
      rowKey={(item) => item.bookId}
      dataSource={purchasedBook}
      renderItem={(item) => (
        <BookItem
          description={item.description}
          bookId={item.bookId}
          title={item.title}
          cover_url={item.cover_url}
        />
      )}
    />
  );
};

export default PurchasedBookList;
