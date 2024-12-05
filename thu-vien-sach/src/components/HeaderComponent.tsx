import { Button, Divider, Input, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { useEffect } from "react";
import { AddAuth, authState, AuthState } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppConstants } from "../appConstants";
import { validateToken } from "../utils/jwtUtil";
import UserTool from "./UserTool";
import { Link, useNavigate } from "react-router-dom";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import axios, { AxiosResponse } from "axios";
import { ResponseDTO } from "../dtos/ResponseDTO";
import { User } from "firebase/auth";

const HeaderComponent = () => {
  const auth: AuthState = useSelector(authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems: ItemType<MenuItemType>[] = [
    {
      key: "home",
      label: (
        <Link className="nav-item" to={"/"}>
          Trang chủ
        </Link>
      ),
    },
    {
      key: "about",
      label: (
        <Link className="nav-item" to={"/"}>
          Về chúng tôi
        </Link>
      ),
    },
    {
      key: "vision",
      label: (
        <Link className="nav-item" to={"/"}>
          Tầm nhìn
        </Link>
      ),
    },
    {
      key: "contact-us",
      label: (
        <Link className="nav-item" to={"/"}>
          Liên hệ
        </Link>
      ),
    },
  ];

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const res = localStorage.getItem(AppConstants.token);
      if (!res) {
        return;
      }
      if (!validateToken(res)) {
        return;
      }
      const userRes: AxiosResponse<ResponseDTO<User>> = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/user/info`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(res)}`,
          },
        }
      );
      dispatch(AddAuth({ token: res, user: userRes.data.data }));
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <Header className="d-flex flex-row justify-content-between align-items-center bg-white shadow-sm rounded">
      <Menu
        items={menuItems}
        mode="horizontal"
        defaultSelectedKeys={["home"]}
        style={{ flex: 1, marginRight: "2rem" }}
      />

      <div className="d-flex flex-row align-items-center gap-3">
        <Input.Search
          placeholder="Nhập tên sách cần tìm"
          style={{ width: "250px" }}
        />

        <Divider type="vertical" />

        {!auth.token ? (
          <div className="d-flex gap-2 align-items-center">
            <Button
              type="primary"
              className="bg-warning"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </Button>
            <Button type="primary" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
          </div>
        ) : (
          <UserTool />
        )}
      </div>
    </Header>
  );
};

export default HeaderComponent;
