import React, { useEffect, useState } from 'react'
import { handleAPI } from '../remotes/apiHandle';
import { ResponseDTO } from '../dtos/ResponseDTO';
import Book from '../models/book/Book';
import { AxiosResponse } from 'axios';
import BookCard from '../components/books/BookCard';
import { message, Typography } from 'antd';
import { Link } from 'react-router-dom';

const HomePage = () => {

  const [isLoading, setLoading] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState<number>(1);
  const [books, setBooks] = useState<Book[]>([])

  useEffect(()=>{
    getBooks(pageNum)
  },[pageNum])

  const getBooks = async ( page: number ) => {
    setLoading(true)
    try {
    const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(`books?page=${page}&pageSize=10&sort=Title&order=desc`)
    setBooks(res.data.data)
    } catch (error: any) {
      console.log(error)
      message.error(error.response.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
     <div className="d-flex flex-row justify-content-between align-items-center ">
     <Typography.Title className='d-inline mb-0' >Nên đọc</Typography.Title>
     <Link to={'books'} >Xem thêm</Link>
     </div>
      <div className="d-flex flex-row gap-3">
        {books.map((book) => <BookCard book={book} key={book.BookID} />)}
      </div>
      <div className="d-flex flex-row justify-content-between align-items-center ">
      <Typography.Title className='d-inline mb-0' >Tác giả</Typography.Title>
      <Link to={'authors'} >Xem thêm</Link>
      </div>
      </div>
  )
}

export default HomePage