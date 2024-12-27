import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import BookDetailPage from "../pages/books/BookDetailPage";
import { Layout } from "antd";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import HeaderComponent from "../components/HeaderComponent";
import AuthPage from "../pages/AuthPage";
import VerifyPage from "../pages/VerifyPage";
import FooterComponent from "../components/FooterComponent";
import BookPage from "../pages/books/BookPage";
import AuthorsPage from "../pages/authors/AuthorsPage";
import BookReader from "../pages/books/BookReader";
import UserInformationPage from "../pages/users/UserInformationPage";
import { useDispatch, useSelector } from "react-redux";
import { AddAuth, AuthState, authState } from "../redux/authSlice";
import SubscribePage from "../pages/memberships/SubscribePage";
import ConfirmOrder from "../pages/payment/ConfirmOrder";
import PaymentResult from "../pages/payment/PaymentResult";
import CategoryDetailPage from "../pages/categories/CategoryDetailPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import AuthorDetailPage from "../pages/authors/AuthorDetailPage";
import axios, { AxiosResponse } from "axios";
import { User } from "firebase/auth";
import { useEffect } from "react";
import { AppConstants } from "../appConstants";
import { ResponseDTO } from "../dtos/ResponseDTO";
import { UserMembership } from "../models/UserMembership";
import { validateToken } from "../utils/jwtUtil";

interface Props {
  authState: AuthState;
}

const MainLayout = () => {
  return (
    <Layout className="mx-5 m-3">
      <Outlet />
    </Layout>
  );
};

const MainRouter = () => {
  const autState = useSelector(authState);


  const dispatch = useDispatch();

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

      const membershipRes: AxiosResponse<ResponseDTO<UserMembership>> =
        await axios.get(`${process.env.REACT_APP_BASE_URL}/membership/check`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(res)}`,
          },
        });

      dispatch(
        AddAuth({
          token: JSON.parse(res),
          user: userRes.data.data,
          membership: membershipRes.data.data,
        })
      );
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <BrowserRouter>
      <Layout className="p-0 m-0">
        <HeaderComponent />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="user/user-detail"
              element={
                <UserInformationPage
                  user={autState.user}
                  membership={autState.membership}
                />
              }
            />
            <Route path="books" element={<BookPage />} />
            <Route path="books/:bookId" element={<BookDetailPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route
              path="categories/:categoryId"
              element={<CategoryDetailPage />}
            />
            <Route path="authors" element={<AuthorsPage />} />
            <Route path="authors/:authorId" element={<AuthorDetailPage />} />
            <Route path="login" element={<AuthPage action="LOGIN" />} />
            <Route path="register" element={<AuthPage action="REGISTER" />} />
            <Route path="notification/user/verify/:token" element={<VerifyPage />} />
            <Route path="membership/subscribe" element={<SubscribePage />} />
            <Route path="confirm-order" element={<ConfirmOrder />} />
            <Route
              path="notification/payment-result"
              element={<PaymentResult />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="books/:bookId/read" element={<BookReader />} />
        </Routes>
        <FooterComponent />
      </Layout>
    </BrowserRouter>
  );
};
export default MainRouter;
