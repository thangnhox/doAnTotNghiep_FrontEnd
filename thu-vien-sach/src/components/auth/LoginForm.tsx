import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { AppConstants } from "../../appConstants";
import axios, { AxiosResponse } from "axios";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import Token from "../../models/Token";
import { handleAPI } from "../../remotes/apiHandle";
import { useDispatch } from "react-redux";
import { AddAuth } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { GoogleOutlined } from "@ant-design/icons";
import { signInWithPopup } from "firebase/auth";
import { firebaseAuth, authProvider } from "../../firebase/firebaseConfig";
import User from "../../models/User";
import Membership from "../../models/Membership";
import Link from "antd/es/typography/Link";

const LoginForm = () => {
  const [loginForm] = useForm();
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { Text } = Typography;

  const login = async () => {
    const email: string = loginForm.getFieldValue("email");
    const password: string = loginForm.getFieldValue("password");
    try {
      setLoading(true);
      const req = {
        email,
        password,
      };
      const res: AxiosResponse<ResponseDTO<Token>> = await handleAPI(
        `user/login`,
        req,
        "post"
      );
      if (res.status === 200) {
        const token = res.data.data;
        const userRes: AxiosResponse<ResponseDTO<User>> = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user/info`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const membershipRes: AxiosResponse<ResponseDTO<Membership>> =
          await axios.get(
            `${process.env.REACT_APP_BASE_URL}/membership/check`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        localStorage.setItem(
          AppConstants.token,
          JSON.stringify(res.data.data)
        );
        dispatch(
          AddAuth({
            token: token,
            user: userRes.data.data,
            membership: membershipRes.data.data ?? null,
          })
        );
        navigator("/", { replace: true });
        message.success("Đăng nhập thành công");
      }
    } catch (error: any) {
      message.error("Email hoặc mật khẩu không đúng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(firebaseAuth, authProvider);
      if (!result) {
        return;
      }
      const user = result.user.toJSON();
      const res: AxiosResponse<ResponseDTO<Token>> = await handleAPI(
        `user/google`,
        user,
        "post"
      );
      if (res.status === 200) {
        const token = res.data.data;
        const userRes: AxiosResponse<ResponseDTO<User>> = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user/info`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.setItem(
          AppConstants.token,
          JSON.stringify({ token: token })
        );
        dispatch(AddAuth({ token: token, user: userRes.data.data }));
        localStorage.setItem(
          AppConstants.token,
          JSON.stringify(res.data.data)
        );
        navigator("/", { replace: true });
        message.success("Đăng nhập thành công");
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card loading={isLoading} title="Đăng nhập">
      <Form form={loginForm} onFinish={login} layout="vertical" >
        <Form.Item
          name={"email"}
          label="Email"
          rules={[
            {
              required: true,
              min: 3,
              message: "Email không được trống",
            },
            {
              pattern: AppConstants.regex.email,
              message: "Email không đúng định dạng",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"password"}
          label="Mật khẩu"
          rules={[
            {
              required: true,
              min: 3,
              message: "Mật khẩu không được trống",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        {/* <Form.Item initialValue={isRememberMe} valuePropName="checked">
          <Checkbox onChange={(val) => setRememberMe(val.target.checked)}>
            Ghi nhớ đăng nhập
          </Checkbox>
        </Form.Item> */}
        <Form.Item>
          <Link href="/reset-password">Đặt lại mật khẩu</Link>
        </Form.Item>
        <Button type="primary" onClick={() => loginForm.submit()}>
          Đăng nhập{" "}
        </Button>
      </Form>
      <Divider />
      <Button onClick={signInWithGoogle}>
        <Text>Đăng nhập bằng google</Text>
        <GoogleOutlined />
      </Button>
    </Card>
  );
};

export default LoginForm;
