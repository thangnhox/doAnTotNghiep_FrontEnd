import React from "react";
import { useParams } from "react-router-dom";

const PaymentResult = () => {
  const {
    partnerCode,
    orderId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
  } = useParams();
  return <div>PaymentResult</div>;
};

export default PaymentResult;
