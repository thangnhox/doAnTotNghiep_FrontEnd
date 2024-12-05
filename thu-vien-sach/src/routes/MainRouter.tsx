import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { authState } from "../redux/authSlice";
import CategoriesPage from "../pages/CategoriesPage";
import SubscribePage from "../pages/memberships/SubscribePage";

const MainRouter = () => {
  const autState = useSelector(authState);
  return (
    <BrowserRouter>
      <Layout className="p-0 m-0">
        <HeaderComponent />
        <Content className="mx-5 m-3">
          <Routes>
            <Route index element={<HomePage />} />
            <Route
              path="/user/user-detail"
              element={<UserInformationPage user={autState.user} />}
            />
            <Route path="/book/:bookId" element={<BookDetailPage />} />
            <Route path="/books" element={<BookPage />} />
            <Route path="/book/:bookId/read" element={<BookReader />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/login" element={<AuthPage action="LOGIN" />} />
            <Route path="/register" element={<AuthPage action="REGISTER" />} />
            <Route path="/user/verify/:token" element={<VerifyPage />} />
            <Route path="/membership/subscribe" element={<SubscribePage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
          </Routes>
        </Content>
        <FooterComponent />
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
