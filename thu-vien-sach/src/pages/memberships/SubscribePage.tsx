import { Button, Card, Divider, Modal, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import Membership from "../../models/Membership";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { handleAPI } from "../../remotes/apiHandle";

const SubscribePage = () => {
  const { Title, Text } = Typography;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);

  useEffect(() => {
    getMemberships();
  }, []);

  const getMemberships = async () => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Membership[]>> = await handleAPI(
        `membership`
      );
      setMemberships(res.data.data);
      console.log(res.data.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const performPurchase = (id: number) => {};

  return isLoading ? (
    <Spin />
  ) : (
    <div className="d-flex justify-content-center gap-5">
      {memberships.map((item) => (
        <Card className="w-25 " title={item.name} key={item.id}>
          <ul className="text-start">
            {/* {item.description.map((des) => (
              <li>{des}</li>
            ))} */}
          </ul>
          <Divider type="horizontal" />
          <div className="d-flex flex-column">
            <Text>{`Giá tiền: ${item.price} VND`}</Text>
            <Button
              className="mt-3"
              type="primary"
              onClick={() => performPurchase(item.id)}
            >
              Đăng ký
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SubscribePage;
