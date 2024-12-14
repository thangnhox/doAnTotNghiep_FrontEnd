import { Button, Result } from "antd";
import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const PaymentResult = () => {
  const resultCode = new URLSearchParams(window.location.search).get(
    "resultCode"
  );
  const message = new URLSearchParams(window.location.search).get("message");
  const navigate = useNavigate();

  return (
    <Result
      status={Number(resultCode) === 0 ? "success" : "error"}
      title={message}
      extra={[
        <Button type="primary" onClick={() => navigate(`/`)}>
          Về trang chủ
        </Button>,
      ]}
    />
  );
};

export default PaymentResult;
