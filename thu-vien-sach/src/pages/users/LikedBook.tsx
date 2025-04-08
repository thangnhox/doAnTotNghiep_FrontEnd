import { List } from 'antd'
import { useEffect, useState } from 'react'
import Book from '../../models/book/Book'
import { handleAPI } from '../../remotes/apiHandle'
import BookItem from '../../components/book/BookItem'

const LikedBook = () => {

    const [likedBooks, setLikedBooks] = useState<Book[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        getLikedBooks()
    }, [])

    const getLikedBooks = async () => {
        try {
            setLoading(true)
            const res = await handleAPI(`books/liked`)
            if (res.data.data.likedBooks) {
                setLikedBooks(res.data.data.likedBooks)
            }
        } catch (error: any) {
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <List
            loading={isLoading}
            bordered
            rowKey={(item) => item.BookID}
            dataSource={likedBooks}
            renderItem={(item) => (
                <div className='m-3'>
                    <BookItem
                        description={item.Description}
                        bookId={item.BookID}
                        title={item.Title}
                        cover_url={item.cover_url}
                        action="read"
                    />
                </div>
            )}
        />
    )
}

export default LikedBook