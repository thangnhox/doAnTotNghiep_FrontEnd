import React from "react";
import Membership from "../../models/Membership";
import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  membership: Membership | null;
  expireDate: string;
}

const MembershipCardInfo = (prop: Props) => {
  const { membership, expireDate } = prop;
  const { Title, Text } = Typography;
  const navigate = useNavigate();

  return (
    <Card>
      <div className="d-flex flex-column gap-2">
        <Title level={3}>{membership?.name ?? "Chưa đăng ký thành viên"}</Title>
        <Text type="secondary">{expireDate}</Text>
        {!membership && (
          <Button
            className="mt-2"
            type="primary"
            onClick={() => navigate(`/membership/subscribe`)}
          >
            Đăng ký gói thành viên
          </Button>
        )}
      </div>
    </Card>
  );
};

export default MembershipCardInfo;
