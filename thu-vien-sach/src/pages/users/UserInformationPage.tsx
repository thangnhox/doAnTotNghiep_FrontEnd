import React, { useEffect, useState } from "react";
import User from "../../models/User";
import { Card, Divider, Menu, MenuProps } from "antd";
import UserInfo from "../../components/user/UserInfo";
import MembershipCardInfo from "../../components/user/MembershipCardInfo";
import Membership from "../../models/Membership";
import axios, { AxiosResponse } from "axios";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { handleAPI } from "../../remotes/apiHandle";
import { getAccessToken } from "../../remotes/axiosConfig";
import { authState } from "../../redux/authSlice";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import ReadBookList from "./ReadBookList";
import PurchasedBookList from "./PurchasedBookList";
import MyDictionary from "./MyDictionary";
import RequestedBookList from "./RequestedBookList";
import { Content } from "antd/es/layout/layout";
import { SelectInfo } from "antd/es/calendar/generateCalendar";

interface PageProp {
  user: User | null;
}

const UserInformationPage = (props: PageProp) => {
  const { user } = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [expiredDate, setExpiredDate] = useState<string | null>(null);
  const [userAction, setUserAction] = useState<string>("dashboard");
  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      label: "Trang chủ",
    },
    {
      key: "history-read-book",
      label: "Sách đã đọc",
    },
    {
      key: "history-purchased-book",
      label: "Sách đã mua",
    },
    {
      key: "dictionary",
      label: "Từ điển",
    },
    {
      key: "book-request",
      label: "Yêu cầu thêm sách",
    },
  ];

  useEffect(() => {
    getMembershipInfo();
  }, []);

  const getMembershipInfo = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const res = await axios.get("membership/check", {
        headers: {
          Authorization: `Beare ${token}`,
        },
      });
      setMembership(res.data.data.membership);
      setExpiredDate(res.data.data.expireDate);
    } catch (error: any) {
      console.log(error);
    }
  };

  const renderContent = (actionKey: string) => {
    switch (actionKey) {
      case "dashboard":
        return <Dashboard />;
      case "history-read-book":
        return <ReadBookList />;
      case "history-purchased-book":
        return <PurchasedBookList />;
      case "dictionary":
        return <MyDictionary />;
      case "book-request":
        return <RequestedBookList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="d-flex flex-row w-100 gap-3 justify-content-center">
      <Menu
        items={menuItems}
        className="rounded"
        onClick={({ item, key, keyPath, domEvent }) => setUserAction(key)}
      />
      <Card className="w-50">
        <div className="d-flex flex-column gap-3">
          <div className="row">
            <div className="col">
              <UserInfo
                avatarUrl={user?.avatar}
                email={user?.email ?? "guest@example.com"}
                fullName={user?.name ?? "Guest"}
              />
            </div>
            <div className="col">
              <MembershipCardInfo
                membership={membership}
                expireDate={expiredDate ?? "N/a"}
              />
            </div>
          </div>
          <Divider />
          {renderContent(userAction)}
        </div>
      </Card>
    </div>
  );
};

export default UserInformationPage;
