import React, { useEffect, useState } from 'react'
import Book from '../../models/book/Book';
import { AxiosResponse } from 'axios';
import { message, Spin } from 'antd';
import { handleAPI } from '../../remotes/apiHandle';
import { ResponseDTO } from '../../dtos/ResponseDTO';
import BookCard from '../../components/books/BookCard';
import Search from 'antd/es/input/Search';

const BookPage = () => {

  const [isLoading, setLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([])
  const [pageNum, setPageNum] = useState<number>(1)

  useEffect(() => {
    getBooks(pageNum);
  }, [pageNum])

  const getBooks = async (pageNum: number) => {
    try {
      setLoading(true)
      const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(`books?page=${pageNum}&pageSize=5&sort=Title&order=desc`)
      setBooks(res.data.data)
    } catch (error: any) {
      message.error(error.response.message)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (input: string) => {
    console.log(input)
  }

  return (
    isLoading ? <Spin/> : <div className="d-flex flex-column w-75 gap-4 mx-auto">
    {/* Khung tìm kiếm */}
    <div className="d-flex justify-content-end">
      <Search
        placeholder="Nhập tên sách cần tìm"
        className="w-25"
        allowClear
        enterButton="Tìm kiếm"
        onSearch={performSearch}
      />
    </div>
  
    {/* Danh sách sách */}
    <div className="container-fluid">
      <div className="row g-3">
        {books.map((book) => (
          <div className="col-4" key={book.BookID}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default BookPage