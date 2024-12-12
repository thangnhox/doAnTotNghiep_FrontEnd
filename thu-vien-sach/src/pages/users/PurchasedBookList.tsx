import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authState } from "../../redux/authSlice";
import Book from "../../models/book/Book";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { handleAPI } from "../../remotes/apiHandle";
import { List, Spin } from "antd";
import BookItem from "../../components/book/BookItem";

const PurchasedBookList = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [purchasedBook, setPurchasedBook] = useState<Book[]>([]);

  useEffect(() => {
    getPurchasedBook();
  }, []);

  const getPurchasedBook = async () => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(
        `order/boughtBooks`
      );
      setPurchasedBook(res.data.data);
      console.log(res.data.data);
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
      dataSource={purchasedBook}
      renderItem={(item) => <BookItem book={item} />}
    />
  );
};

export default PurchasedBookList;
