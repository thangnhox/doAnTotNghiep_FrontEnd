import React from "react";
import Book from "../../models/book/Book";
import { Button, Image, List, Typography } from "antd";

interface Props {
  book: Book;
}

const BookItem = (props: Props) => {
  const { book } = props;
  const { Text } = Typography;
  return (
    <div className="d-flex flex-row justify-content-between align-items-center">
      <div className="d-flex flex-row gap-3">
        <Image
          preview={false}
          src={book.cover_url}
          width={75}
          className="bordered"
        />
        <Text>{book.Title}</Text>
        <Text>{book.Description}</Text>
      </div>
      <Button type="primary">Đọc</Button>
      <div className="d-flex flex-column"></div>
    </div>
  );
};

export default BookItem;
