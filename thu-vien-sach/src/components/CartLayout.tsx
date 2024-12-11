import { Button, List, Typography } from "antd";
import { CartState, ChangeOpenCloseCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";

interface Props {
  cart: CartState;
}

const CartLayout = (props: Props) => {
  const { cart } = props;
  const { Text } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const placeOrder = async () => {
    dispatch(ChangeOpenCloseCart(false));
    navigate(`/confirm-order`);
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={cart.books}
      rowKey={(item) => item.BookID}
      renderItem={(item) => <CartItem book={item} />}
      footer={
        <div className="d-flex flex-column w-100 gap-3">
          <div className="d-flex flex-row p-2 justify-content-between align-items-center w-100">
            <Text>Tổng giá</Text>
            <Text>{cart.total} VND</Text>
          </div>
          <Button
            onClick={() => {
              placeOrder();
            }}
            type="primary"
          >
            Thanh toán
          </Button>
        </div>
      }
    />
  );
};

export default CartLayout;
