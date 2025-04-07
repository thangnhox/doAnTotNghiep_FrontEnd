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
import { numbericFormat } from "../../utils/numbericUtil";

const { Text } = Typography; // Ensure the correct Text component is destructured

const BookDetailPage = () => {
  const { bookId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, message: "" });
  const [book, setBook] = useState<Book | null>(null);
  const [isBought, setIsBought] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const auth = useSelector(authState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const descriptionItems: DescriptionsProps["items"] = [
    { key: "pageCount", label: "Số trang", children: `${book?.PageCount}` },
    { key: "likes", label: "Số lượt thích", children: `${book?.LikesCount}` },
    { key: "price", label: "Giá", children: `${book?.Price} VND` },
    { key: "Description", label: "Thể loại", children: book?.Categories },
    { key: "publishedDate", label: "Ngày xuất bản", children: reFormatToDDMMYY(book?.PublishDate) },
    { key: "publisherName", label: "Nhà xuất bản", children: book?.PublisherName },
    { key: "description", label: "Mô tả", children: book?.Description },
  ];

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse<ResponseDTO<Book>> = await handleAPI(`/books/fetch/${bookId}`);
        setBook(res.data.data);

        if (auth.token) {
          const boughtBooksRes: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(`order/boughtBooks`);
          setIsBought(boughtBooksRes.data.data.some(b => b.BookID === res.data.data.BookID));

          const likedRes = await handleAPI(`books/liked/${bookId}`);
          setIsLiked(likedRes.data.data.liked);
        }
      } catch (error: any) {
        message.error(error.response?.data?.message || "Error fetching book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [auth.token, bookId]);

  const handleAction = (condition: boolean, message: string, callback: () => void) => {
    if (condition) {
      setModalState({ isOpen: true, message });
    } else {
      callback();
    }
  };

  const handleRead = () => {
    handleAction(!auth.token, "Bạn cần đăng nhập để đọc sách!", () => {
      handleAction(
        !isBought && !auth.membership,
        "Bạn chưa đăng ký gói thành viên! Hãy đăng ký để đọc sách này!",
        () => {
          handleAction(
            !auth.user?.birthYear,
            "Bạn chưa cập nhật tuổi! Hãy cập nhật tuổi.",
            () => {
              handleAction(
                !!(book && auth.user?.birthYear && !isUserYearOldValidated(book.rank, auth.user.birthYear)), // Explicitly cast to boolean
                "Bạn chưa đủ tuổi để đọc sách này.",
                () => navigate("read")
              );
            }
          );
        }
      );
    });
  };

  const handleBuy = () => {
    handleAction(!auth.token, "Bạn cần đăng nhập để mua sách!", () => {
      handleAction(
        !auth.user?.birthYear,
        "Bạn chưa cập nhật tuổi! Hãy cập nhật tuổi.",
        () => {
          handleAction(
            !!(book && auth.user?.birthYear && !isUserYearOldValidated(book.rank, auth.user.birthYear)), // Explicitly cast to boolean
            "Bạn chưa đủ tuổi để mua sách này.",
            () => book && dispatch(AddBookToCart(book))
          );
        }
      );
    });
  };

  const handleLike = async () => {
    if (!auth.token) {
      navigate("/login");
      return;
    }
    try {
      const res = await handleAPI(`books/like/${bookId}`);
      if (res.status === 200) {
        const action = res.data.data.action;
        message.success(action === "Liked" ? "Thích sách thành công" : "Bỏ thích sách thành công");
        setBook(prev => prev ? { ...prev, LikesCount: prev.LikesCount + (action === "Liked" ? 1 : -1) } : prev);
        setIsLiked(action === "Liked");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Error liking the book");
    }
  };

  const downloadBook = async (title: string) => {
    try {
      const res = await handleAPI(`books/download/${bookId}`, {}, "get", "blob");
      const pdfUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const aTag = document.createElement("a");
      aTag.href = pdfUrl;
      aTag.setAttribute("download", title || "book.pdf"); // Ensure title fallback
      document.body.appendChild(aTag);
      aTag.click();
      aTag.remove();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Error downloading the book");
    }
  };

  return isLoading ? (
    <Spin />
  ) : (
    <div className="d-flex flex-column justify-content-center w-100 align-items-center">
      <Card title={book?.Title || "Thông tin sách"} style={{ textAlign: "start" }} className="w-50">
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
          <Image
            src={book?.cover_url || ""}
            width={400}
            preview={false}
            alt="Cover Book Image"
            className="rounded shadow-sm"
          />
          <span>
            <strong>Tác giả:</strong> <Text>{book?.AuthorName || "Không rõ"}</Text>
          </span>
          <Text>
            <strong>Ngày phát hành: </strong>
            {reFormatToDDMMYY(book?.PublishDate) || "Không rõ"}
          </Text>
        </div>
        <div className="d-flex justify-content-center align-items-center m-3 gap-3">
          <Button type="primary" size="large" onClick={handleRead}>
            Đọc
          </Button>
          {!isBought ? (
            <Button type="primary" size="large" onClick={handleBuy}>
              Mua {`${numbericFormat(Number(book?.Price || 0))} VND`}
            </Button>
          ) : (
            <Button type="primary" size="large" onClick={() => book && downloadBook(book.Title || "book")}>
              Download
            </Button>
          )}
          <Button danger type="primary" size="large" onClick={handleLike}>
            {isLiked ? "Bỏ thích" : "Thích"}
          </Button>
        </div>
        <Descriptions items={descriptionItems} bordered />
      </Card>
      <Modal
        title="Thông báo"
        open={modalState.isOpen}
        centered
        className="text-center"
        onOk={() => setModalState({ isOpen: false, message: "" })}
        onCancel={() => setModalState({ isOpen: false, message: "" })}
      >
        {modalState.message}
      </Modal>
    </div>
  );
};

export default BookDetailPage;
