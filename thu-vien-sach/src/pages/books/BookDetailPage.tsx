import {
  Button,
  Card,
  Descriptions,
  DescriptionsProps,
  Image,
  message,
  Modal,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Book from "../../models/book/Book";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { handleAPI } from "../../remotes/apiHandle";
import { AxiosResponse } from "axios";
import { reFormatToDDMMYY } from "../../utils/datetimeUtil";
import { useDispatch, useSelector } from "react-redux";
import { authState } from "../../redux/authSlice";
import { AddBookToCart } from "../../redux/cartSlice";
import { isUserYearOldValidated } from "../../utils/userYearOldHandler";
import { LikeOutlined } from "@ant-design/icons";

const BookDetailPage = () => {
  const { bookId } = useParams();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });
  const auth = useSelector(authState);
  const [book, setBook] = useState<Book | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const descriptionItems: DescriptionsProps["items"] = [
    {
      key: "pageCount",
      label: "Số trang",
      children: `${book?.PageCount}`,
      span: "filled",
    },
    {
      key: "likes",
      label: "Số lượt thích",
      children: `${book?.LikesCount}`,
      span: "filled",
    },
    {
      key: "price",
      label: "Giá",
      children: `${book?.Price} VND`,
      span: "filled",
    },
    {
      key: "Description",
      label: "Thể loại",
      children: book?.Categories,
      span: "filled",
    },
    {
      key: "publishedDate",
      label: "Ngày xuất bản",
      children: reFormatToDDMMYY(book?.PublishDate),
      span: "filled",
    },
    {
      key: "publisherName",
      label: "Nhà xuất bản",
      children: book?.PublisherName,
      span: "filled",
    },
    {
      key: "description",
      label: "Mô tả",
      children: book?.Description,
      span: "filled",
    },
  ];
  const { Link, Text } = Typography;

  useEffect(() => {
    getBook();
  }, []);

  const getBook = async () => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Book>> = await handleAPI(
        `/books/fetch/${bookId}`
      );
      setBook(res.data.data);
    } catch (error: any) {
      message.error(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handelUserRead = () => {
    if (!auth.token) {
      navigate("/login");
      return;
    }
    if (!auth.membership) {
      setModalState({
        isOpen: true,
        message:
          "Bạn chưa đăng ký gói thành viên! \n Hãy đăng ký gói thành viên để đọc sách này!",
      });
      return;
    }
    if (!auth.user?.birthYear) {
      setModalState({
        isOpen: true,
        message: "Bạn chưa cập nhật tuổi! Hãy cập nhật tuổi",
      });
      return;
    }
    if (book && !isUserYearOldValidated(book.rank, auth.user.birthYear)) {
      setModalState({
        isOpen: true,
        message: "Bạn chưa đủ tuổi để đọc sách này",
      });
      return;
    }
    navigate(`read`);
  };

  const handleBuy = () => {
    if (!auth.token) {
      navigate("/login");
      return;
    }
    if (!auth.user?.birthYear) {
      setModalState({
        isOpen: true,
        message: "Bạn chưa cập nhật tuổi! Hãy cập nhật tuổi",
      });
      return;
    }
    if (book && !isUserYearOldValidated(book.rank, auth.user.birthYear)) {
      setModalState({
        isOpen: true,
        message: "Bạn chưa đủ tuổi để đọc sách này",
      });
      return;
    }
    dispatch(AddBookToCart(book!));
  };

  const handleLike = async () => {};

  return isLoading ? (
    <Spin />
  ) : (
    <div className="d-flex flex-column justify-content-center w-100 align-items-center">
      <Card title={book?.Title} style={{ textAlign: "start" }} className="w-50">
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
          <Image
            src={book?.cover_url}
            width={400}
            preview={false}
            alt="Cover Book Image"
            className="rounded shadow-sm"
          />
          <span>
            <strong>Tác giả:</strong> <Text>{book?.AuthorName}</Text>
          </span>
          <Text>
            <strong>Ngày phát hành: </strong>
            {reFormatToDDMMYY(book?.PublishDate)}
          </Text>
        </div>
        <div className="d-flex justify-content-center align-items-center m-3 gap-3">
          <Button type="primary" size="large" onClick={handelUserRead}>
            Đọc
          </Button>
          <Button type="primary" size="large" onClick={handleBuy}>
            Mua {`${book?.Price} VND`}
          </Button>
          <Button danger type="primary" size="large" onClick={handleLike}>
            Thích <LikeOutlined />
          </Button>
        </div>
        <Descriptions items={descriptionItems} bordered />
      </Card>
      <Modal
        title="Thông báo"
        open={modalState.isOpen}
        centered
        className="text-center"
        onOk={() =>
          setModalState({
            isOpen: false,
            message: "",
          })
        }
        onCancel={() =>
          setModalState({
            isOpen: false,
            message: "",
          })
        }
      >
        {modalState.message}
      </Modal>
    </div>
  );
};

export default BookDetailPage;
