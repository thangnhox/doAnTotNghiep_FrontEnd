import { Button, List, Spin, Typography } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { cartState } from "../../redux/cartSlice";
import { AxiosResponse } from "axios";
import { handleAPI } from "../../remotes/apiHandle";
import { Discount } from "../../models/Discount";
import { redirect, useNavigate } from "react-router-dom";
import { AppConstants } from "../../appConstants";
import CartItem from "../../components/cart/CartItem";

const ConfirmOrder = () => {
  const { Title, Text } = Typography;
  const cartInfo = useSelector(cartState);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const navigate = useNavigate();

  const performPurchase = async () => {
    try {
      setLoading(true);
      const bookIds = cartInfo.books.map((item) => item.BookID);
      const orderRes: AxiosResponse = await handleAPI(
        `order/create`,
        {
          bookIds,
          discountId: discount?.id ?? null,
        },
        "post"
      );
      if (orderRes.status === 200) {
        window.location.href = orderRes.data.data.PayUrl;
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column w-100 mt-3 align-items-center ">
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Title level={2}>Xác nhận thông tin thanh toán</Title>
          <List
            className="mt-3 bg-white "
            bordered
            dataSource={cartInfo.books}
            renderItem={(item) => <CartItem book={item} />}
            footer={
              <div className="d-flex flex-column gap-4 mt-3">
                <div className="d-flex flex-row justify-content-between align-items-center w-100">
                  <Text>Tổng cộng:</Text>
                  <Text>{cartInfo.total} VND</Text>
                </div>
                <Button type="primary" onClick={performPurchase}>
                  Thanh toán
                </Button>
              </div>
            }
          />
        </>
      )}
    </div>
  );
};

export default ConfirmOrder;
