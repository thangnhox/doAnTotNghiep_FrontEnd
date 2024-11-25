import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BookDetailPage from '../pages/books/BookDetailPage'
import { Layout, theme } from 'antd'
import { Content, Footer } from 'antd/es/layout/layout'
import UserDetailPage from '../pages/UserDetailPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import HeaderComponent from '../components/HeaderComponent'
import AuthPage from '../pages/AuthPage'
import VerifyPage from '../pages/VerifyPage'
import FooterComponent from '../components/FooterComponent'
import Sider from 'antd/es/layout/Sider'
import BookPage from '../pages/books/BookPage'
import AuthorsPage from '../pages/authors/AuthorsPage'

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout className='p-0 m-0'>
        <HeaderComponent />
          <Content className='mx-5 App-content m-3'>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path='/user/:userId' element={<UserDetailPage />} />
            <Route path='/book/:bookId' element={<BookDetailPage />} />
            <Route path='/books' element={<BookPage/>} />
            <Route path='/book/:bookId/read' element={<BookDetailPage />} />
            <Route path='/authors' element={<AuthorsPage/>} />
            <Route path='/login' element={<AuthPage action='LOGIN' />} />
            <Route path='/register' element={<AuthPage action='REGISTER' />} />
            <Route path='/user/verify/:token' element={<VerifyPage/>}/>
            <Route path='/not-found' element={<NotFoundPage />} />
          </Routes>
        </Content>
        <FooterComponent />
      </Layout>
    </BrowserRouter>
  )
}

export default MainRouter