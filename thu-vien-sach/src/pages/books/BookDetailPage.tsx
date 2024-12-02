import { Button, Card, Descriptions, DescriptionsProps, Divider, Image, message, Spin, Tooltip, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import Book from '../../models/book/Book';
import { ResponseDTO } from '../../dtos/ResponseDTO';
import { handleAPI } from '../../remotes/apiHandle';
import { AxiosResponse } from 'axios';
import DescriptionTextIconComponent from '../../components/DescriptionTextIconComponent';
import { reFormatToDDMMYY } from '../../utils/datetimeUtil';
import { BookOutlined, LikeOutlined, ReadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { authState } from '../../redux/authSlice';

const BookDetailPage = () => {

  const { bookId } = useParams();
  const [isLoading, setLoading] = useState<boolean>(false);
  const auth = useSelector(authState);
  const [book, setBook] = useState<Book>();
  const navigate = useNavigate();
  const descriptionItems: DescriptionsProps['items'] = [
    {
      key: 'pageCount',
      label: 'Số trang',
      children: `${book?.PageCount}`,
      span: 'filled'
    },
    {
      key: 'likes',
      label: 'Số lượt thích',
      children: `${book?.LikesCount}`,
      span: 'filled'
    },
    {
      key: 'price',
      label: 'Giá',
      children: `${book?.Price} VND`,
      span: 'filled'
    },
    {
      key: 'Description',
      label: 'Thể loại',
      children: book?.Categories,
      span: 'filled'
    },
    {
      key: 'publishedDate',
      label: 'Ngày xuất bản',
      children: reFormatToDDMMYY(book?.PublishDate),
      span: 'filled'
    },
    {
      key: 'publisherName',
      label: 'Nhà xuất bản',
      children: book?.PublisherName,
      span: 'filled'
    },
    {
      key: 'description',
      label: 'Mô tả',
      children: book?.Description,
      span: 'filled'
    },
  ]
  const { Link, Text } = Typography

  useEffect(() => {
    getBook()
  }, [])

  const getBook = async () => {
    try {
      setLoading(true)
      const res: AxiosResponse<ResponseDTO<Book>> = await handleAPI(`/books/fetch/${bookId}`);
      setBook(res.data.data)
      console.log(book)
    } catch (error: any) {
      message.error(error);
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handelUserRead = () => {
    if(!auth.token){
      navigate("/login");
      return;
    }
    // navigate(`read`)
  }

  return isLoading ? <Spin /> : (
    <div className="d-flex flex-column justify-content-center w-100 align-items-center">
      <Card title={book?.Title} style={{ textAlign: 'start' }} className='w-50' >
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
          <Image
            src={book?.cover_url}
            width={400}
            preview={false}
            alt="Cover Book Image"
            className="rounded shadow-sm"
          />
          <Text>Tác giả: <Link>{book?.AuthorName}</Link></Text>
          <Text>Ngày phát hành: {reFormatToDDMMYY(book?.PublishDate)}</Text>
        </div>
        <div className="d-flex justify-content-center align-items-center m-3 gap-3">
          <Button
            type='primary'
            size="large"
          onClick={handelUserRead}
          >
            Đọc
          </Button>
          <Button
            type='primary'
            size="large"
          // onClick={() => navigate("read")}
          >
            Mua {`${book?.Price} VND`}
          </Button>
        </div>
        <Descriptions items={descriptionItems} bordered />
      </Card>
    </div>
  )

}

export default BookDetailPage