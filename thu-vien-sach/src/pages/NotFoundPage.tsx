import { Button, Empty, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="Không tìm thấy trang"
      extra={[
        <Button type="primary" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>,
      ]}
    />
  );
};

export default NotFoundPage;
