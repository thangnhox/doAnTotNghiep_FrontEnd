import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography } from "antd";
import React from "react";

interface Props {
  fullName: string;
  email: string;
  avatarUrl?: string;
  birthYead?: string;
}

const UserInfo = (props: Props) => {
  const { fullName, email, avatarUrl, birthYead } = props;
  const { Text, Title } = Typography;

  return (
    <Card>
      <div className="d-flex flex-row gap-3 w-100 align-items-center ">
        {avatarUrl ? (
          <Avatar src={avatarUrl} size={75} />
        ) : (
          <Avatar icon={<UserOutlined />} size={75} />
        )}
        <div className="d-flex flex-column text-start gap-2 ">
          <Title level={4}>
            <strong>{fullName}</strong>
          </Title>
          <Text>
            <strong>Email</strong>: {email}
          </Text>
          <Text>
            <strong>Năm sinh</strong>: {birthYead ?? "N/a"}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default UserInfo;
