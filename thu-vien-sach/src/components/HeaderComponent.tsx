import { Button, Divider, Image, Input } from "antd";
import { Header } from "antd/es/layout/layout";
import { useEffect } from "react";
import { AddAuth, authState, AuthState } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppConstants } from "../appConstants";
import { validateToken } from "../utils/jwtUtil";
import UserTool from "./UserTool";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { ResponseDTO } from "../dtos/ResponseDTO";
import { User } from "firebase/auth";
import { UserMembership } from "../models/UserMembership";

const HeaderComponent = () => {
  const auth: AuthState = useSelector(authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            Authorization: `Bearer ${JSON.parse(res).token}`,
          },
        }
      );

      const membershipRes: AxiosResponse<ResponseDTO<UserMembership>> =
        await axios.get(`${process.env.REACT_APP_BASE_URL}/membership/check`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(res).token}`,
          },
        });

      dispatch(
        AddAuth({
          token: res,
          user: userRes.data.data,
          membership: membershipRes.data.data,
        })
      );
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <Header className="d-flex flex-row justify-content-between align-items-center bg-white shadow-sm rounded">
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/thu-vien-sach-truc-tuyen.firebasestorage.app/o/avatar%2Flogo.png?alt=media&token=a39fe59b-8fde-40db-b228-6c66284dda6d"
        width={60}
        preview={false}
        onClick={() => navigate("/")}
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
