import { useEffect, useState } from "react";
import User from "../../models/User";
import { Card, Divider, Menu, MenuProps } from "antd";
import UserInfo from "../../components/user/UserInfo";
import MembershipCardInfo from "../../components/user/MembershipCardInfo";
import ReadBookList from "./ReadBookList";
import PurchasedBookList from "./PurchasedBookList";
import MyDictionary from "./MyDictionary";
import RequestedBookList from "./RequestedBookList";
import { UserMembership } from "../../models/UserMembership";
import LikedBook from "./LikedBook";

interface PageProp {
  user: User | null;
  membership: UserMembership | null;
}

const UserInformationPage = (props: PageProp) => {
  const { user, membership } = props;
  const [userAction, setUserAction] = useState<string>("dashboard");
  const menuItems: MenuProps["items"] = [
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
      key: "liked-book",
      label: "Sách yêu thích",
    },
    {
      key: "book-request",
      label: "Yêu cầu thêm sách",
    },
  ];

  const renderContent = (actionKey: string) => {
    switch (actionKey) {
      case "history-read-book":
        return <ReadBookList />;
      case "history-purchased-book":
        return <PurchasedBookList />;
      case "dictionary":
        return <MyDictionary />;
      case "book-request":
        return <RequestedBookList />;
      case "liked-book":
        return <LikedBook />
      default:
        return <ReadBookList />;
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
                birthYear={user?.birthYear ?? "N/a"}
              />
            </div>
            <div className="col">
              <MembershipCardInfo membership={membership} />
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
