import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import BookDetailPage from "../pages/books/BookDetailPage";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
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
import { useSelector } from "react-redux";
import { AuthState, authState } from "../redux/authSlice";
import CategoriesPage from "../pages/CategoriesPage";
import SubscribePage from "../pages/memberships/SubscribePage";
import ConfirmOrder from "../pages/payment/ConfirmOrder";
import PaymentResult from "../pages/payment/PaymentResult";

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
            <Route path="book/:bookId" element={<BookDetailPage />} />
            <Route path="books" element={<BookPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="authors" element={<AuthorsPage />} />
            <Route path="login" element={<AuthPage action="LOGIN" />} />
            <Route path="register" element={<AuthPage action="REGISTER" />} />
            <Route path="user/verify/:token" element={<VerifyPage />} />
            <Route path="membership/subscribe" element={<SubscribePage />} />
            <Route path="confirm-order" element={<ConfirmOrder />} />
            <Route
              path="notification/payment-result"
              element={<PaymentResult />}
            />
            <Route path="not-found" element={<NotFoundPage />} />
          </Route>
          <Route path="book/:bookId/read" element={<BookReader />} />
        </Routes>
        <FooterComponent />
      </Layout>
    </BrowserRouter>
  );
};
export default MainRouter;
