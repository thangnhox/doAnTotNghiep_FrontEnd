import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  MenuProps,
  Popover,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { authState, RemoveAuth } from "../redux/authSlice";
import {
  NotificationOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { cartState, ChangeOpenCloseCart, ClearCart } from "../redux/cartSlice";
import CartLayout from "./CartLayout";

const UserTool = () => {
  const { Text } = Typography;
  const user = useSelector(authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(cartState);
  const items: MenuProps["items"] = [
    {
      key: "user-infomation",
      label: (
        <Link className="nav-item" to={"user/user-detail"}>
          Thông tin
        </Link>
      ),
    },
    {
      key: "logout",
      danger: true,
      label: "Đăng xuất",
      onClick: () => handleLogout(),
    },
  ];

  const handleLogout = () => {
    dispatch(RemoveAuth());
    dispatch(ClearCart());
    navigate("/");
  };

  const renderCartContent = () => {
    if (!cart.books.length) {
      return <Text type="secondary">Giỏ hàng của bạn trống</Text>;
    }
    return <CartLayout cart={cart} />;
  };

  return (
    <div className="d-flex flex-row justify-content-end align-items-center gap-4 mt-3">
      <Dropdown menu={{ items }}>
        {user?.user?.avatar ? (
          <Avatar src={user.user.avatar} />
        ) : (
          <Avatar icon={<UserOutlined />} />
        )}
      </Dropdown>

      <div className="d-flex flex-column text-start ">
        <Text>
          <strong>{user?.user?.name || "Guest"}</strong>
        </Text>
        <Text>{user?.user?.email || "guest@example.com"}</Text>
      </div>

      <Popover
        trigger={"click"}
        content={renderCartContent()}
        placement="bottom"
        open={cart.open}
        onOpenChange={(val) => dispatch(ChangeOpenCloseCart(val))}
      >
        <Badge count={cart.books.length}>
          <Button shape="circle" icon={<ShoppingCartOutlined />} />
        </Badge>
      </Popover>
      <Button shape="circle" icon={<NotificationOutlined />} />
    </div>
  );
};

export default UserTool;
