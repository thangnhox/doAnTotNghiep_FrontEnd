import { Button, Divider, Input, List, message, Spin, Typography } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { cartState } from "../../redux/cartSlice";
import { AxiosResponse } from "axios";
import { handleAPI } from "../../remotes/apiHandle";
import { Discount } from "../../models/Discount";
import CartItem from "../../components/cart/CartItem";
import { ResponseDTO } from "../../dtos/ResponseDTO";

const ConfirmOrder = () => {
  const { Title, Text } = Typography;
  const cartInfo = useSelector(cartState);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [discount, setDiscount] = useState<Discount | null>(null);

  const performPurchase = async () => {
    try {

      setLoading(true);
      const bookIds = cartInfo.books.map((item) => item.BookID);
      const orderRes: AxiosResponse = await handleAPI(
        `order/create`,
        {
          bookIds,
          discountName: discount?.name ?? null,
        },
        "post"
      );
      if (orderRes.status === 200) {
        console.log(orderRes)
        window.location.href = orderRes.data.data.PayUrl;
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const applyDiscount = async () => {
    try {
      setLoading(true);
      const values = (document.getElementById("discountInput") as HTMLInputElement).value.trim();
      const res: AxiosResponse<ResponseDTO<Discount[]>> = await handleAPI(
        `discount/fetch/${values}`
      );
      console.log(res.data.data)
      if (res.data.data[0].status === 0) {
        message.error("Mã giảm giá không tồn tại hoặc đã hết hạn");
        return;
      }
      else {
        setDiscount(res.data.data[0]);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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
                <div className="d-flex flex-row gap-3 justify-content-between align-items-center ">
                  <Input
                    id="discountInput"
                    placeholder="Nhập mã giảm giá" />
                  <Button type="primary" onClick={applyDiscount} >Áp dụng mã</Button>
                </div>
                <Divider />
                {
                  discount && discount.status !== 0 ? (
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex flex-row justify-content-between align-items-center w-100">
                        <Text>Mã giảm giá:</Text>
                        <Text>{discount.name ?? "N/A"}</Text>
                      </div>
                      <div className="d-flex flex-row justify-content-between align-items-center w-100">
                        <Text>Tỉ lệ giảm:</Text>
                        <Text>{discount.ratio ?? "N/A"}%</Text>
                      </div>
                    </div>
                  ) : null}
                <>
                  <div className="d-flex flex-row justify-content-between align-items-center w-100">
                    <Text>Tổng cộng:</Text>
                    {
                      !discount ? <Text>{cartInfo.total} VND</Text> :
                        <div className="d-flex flex-column gap-1" >
                          <Text >{cartInfo.total - (cartInfo.total * discount.ratio)} VND</Text>
                          <Text type="danger" delete  >{cartInfo.total} VND</Text>
                        </div>
                    }
                  </div>
                  <Divider />
                </>
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
