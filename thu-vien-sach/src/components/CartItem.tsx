import { DeleteFilled } from "@ant-design/icons";
import { Button, Divider, Image, List, Typography } from "antd";
import { useDispatch } from "react-redux";
import { RemoveBookFromCart } from "../redux/cartSlice";
import Book from "../models/book/Book";

interface Props {
  book: Book;
}

const CartItem = (props: Props) => {
  const { Title, Text } = Typography;
  const { book } = props;
  const dispatch = useDispatch();
  return (
    <List.Item>
      <div className="d-flex flex-row p-2 gap-3 justify-content-between align-items-center w-100">
        <Image src={book.cover_url} preview={false} width={100} />
        <div className="d-flex flex-column" style={{ flex: 1 }}>
          <Title level={5}>{book.Title}</Title>
          <Text type="secondary">{book.Price}</Text>
        </div>
        <Divider type="vertical" />
        <Button
          shape="circle"
          icon={<DeleteFilled />}
          onClick={() => dispatch(RemoveBookFromCart(book))}
        />
      </div>
    </List.Item>
  );
};

export default CartItem;
