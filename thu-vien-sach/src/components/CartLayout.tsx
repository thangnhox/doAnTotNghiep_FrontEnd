import { Button, Divider, Image, List, Typography } from "antd";
import React from "react";
import { CartState, RemoveBookFromCart } from "../redux/cartSlice";
import { DeleteFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";

interface Props {
  cart: CartState;
}

const CartLayout = (props: Props) => {
  const { cart } = props;
  const { Text, Title } = Typography;
  const dispatch = useDispatch();

  const performPurchase = () => {};

  return (
    <List
      itemLayout="horizontal"
      dataSource={cart.books}
      rowKey={(item) => item.BookID}
      renderItem={(item) => (
        <List.Item>
          <div className="d-flex flex-row p-2 gap-3 justify-content-between align-items-center w-100">
            <Image src={item.cover_url} preview={false} width={100} />
            <div className="d-flex flex-column" style={{ flex: 1 }}>
              <Title level={5}>{item.Title}</Title>
              <Text type="secondary">{item.Price}</Text>
            </div>
            <Divider type="vertical" />
            <Button
              shape="circle"
              icon={<DeleteFilled />}
              onClick={() => dispatch(RemoveBookFromCart(item))}
            />
          </div>
        </List.Item>
      )}
      footer={
        <div className="d-flex flex-column w-100 gap-3">
          <div className="d-flex flex-row p-2 justify-content-between align-items-center w-100">
            <Text>Tổng giá</Text>
            <Text>{cart.total} VND</Text>
          </div>
          <Button onClick={performPurchase} type="primary">
            Thanh toán
          </Button>
        </div>
      }
    />
  );
};

export default CartLayout;
