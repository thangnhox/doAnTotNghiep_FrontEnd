import React from 'react'
import Book from '../../models/book/Book'
import { Button, Card, Image, Space, Typography } from 'antd'

interface Props {
    book: Book;
}

const BookCard = ( props: Props ) => {

    const { Title, Price, cover_url, isRecommend, PageCount } = props.book

  return <Card title={Title} style={{width:400}} >
    <Image src={cover_url} preview={false} width={150} height={200} />
    <p className='mt-3' ><span>Giá: {Price} VND</span></p>
    <p><span>Số trang: {PageCount}</span></p>
    <div className="d-flex flex-row gap-3 align-items-center justify-content-center ">
        <Button type='primary' className='bg-success' >Chi tiết</Button>
        {/* <Button type='primary' className='bg-success' >Đọc</Button> */}
    </div>
  </Card>
}

export default BookCard