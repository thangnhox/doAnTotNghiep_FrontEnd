import {
  Button,
  Card,
  Divider,
  Form,
  Image,
  Input,
  message,
  Pagination,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { handleAPI } from "../../remotes/apiHandle";
import { useForm } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { Note } from "../../models/Note";
import { useSelector } from "react-redux";
import { authState } from "../../redux/authSlice";
import Book from "../../models/book/Book";
import { BookReadHistory } from "../../models/BookReadHistory";

const BookReader = () => {
  const { bookId } = useParams();
  const { Title } = Typography;
  const auth = useSelector(authState);
  const [isLoading, setLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [pageNum, setPage] = useState<number | undefined>(undefined);
  const [book, setBook] = useState<Book | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Record<number, string>>({});
  const [note, setNote] = useState<Note | null>(null);
  const [noteForm] = useForm();

  useEffect(() => {
    fetchBookDetails();
    getLastPageRead();
  }, []);

  useEffect(() => {
    getData();
  }, [pageNum]);

  const getData = async () => {
    if (!pageNum) return;
    try {
      setLoading(true)
      getContent(pageNum ?? 1);
      updateReadingHistory(pageNum ?? 1);
      loadNote();
      preloadImages(pageNum ?? 1);

    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  const updateReadingHistory = async (pageNum: number) => {
    await handleAPI(`history/update/${bookId}/${pageNum}`)
  }


  const fetchBookDetails = async () => {
    const res = await handleAPI(`books/fetch/${bookId}`);
    setBook(res.data.data);
  };

  const getLastPageRead = async () => {
    const res: AxiosResponse<ResponseDTO<BookReadHistory>> =
      await handleAPI(`history/get/${bookId}`);
    setPage(res.data.data.LastRead ?? 1);
  };

  const getContent = async (pageNum: number) => {
    if (preloadedImages[pageNum]) {
      setImage(preloadedImages[pageNum]);
      return;
    }

    const res = await handleAPI(
      `/books/read/${bookId}?page=${pageNum}&width=1000&height=1000&density=200`,
      null,
      "get",
      "blob"
    );
    const blobUrl = URL.createObjectURL(res.data);
    setImage(blobUrl);
    setPreloadedImages((prev) => ({ ...prev, [pageNum]: blobUrl }));

  };

  const preloadImages = async (currentPage: number) => {
    if (!book) return;

    const pagesToPreload = [
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ].filter((page) => page > 0 && page <= book.PageCount);

    const promises = pagesToPreload.map(async (page) => {
      if (!preloadedImages[page]) {
        const res = await handleAPI(
          `/books/read/${bookId}?page=${page}&width=1000&height=1000&density=200`,
          null,
          "get",
          "blob"
        );
        const blobUrl = URL.createObjectURL(res.data);
        return { page, url: blobUrl };
      }
      return null;
    });

    const results = await Promise.all(promises);
    setPreloadedImages((prev) => {
      const updated = { ...prev };
      results.forEach((result) => {
        if (result) updated[result.page] = result.url;
      });
      return updated;
    });

  };

  const loadNote = async () => {
    try {
      setNoteLoading(true);
      const res: AxiosResponse<ResponseDTO<Note[]>> = await handleAPI(
        `notes/search?booksId=${bookId}&exact=true&booksPage=${pageNum}`
      );
      const currentNote = res.data.data[0] || null;
      setNote(currentNote);
      noteForm.setFieldsValue({ detail: currentNote?.detail || "" });
    } catch (error) {
      console.error("Error loading note:", error);
      noteForm.resetFields();
    } finally {
      setNoteLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      setNoteLoading(true);
      const detail: string = noteForm.getFieldValue("detail").trim();

      if (!detail) {
        message.warning("Ghi chú không được để trống.");
        return;
      }

      const notePayload = {
        booksId: bookId,
        page: pageNum,
        detail,
      };

      const res: AxiosResponse<ResponseDTO<Note>> = note
        ? await handleAPI(`notes/update/${note.id}`, notePayload, "put")
        : await handleAPI(`notes/add`, notePayload, "post");

      setNote(res.data.data);
      message.success(note ? "Cập nhật ghi chú thành công" : "Thêm ghi chú thành công");
    } catch (error) {
      console.error("Error saving note:", error);
      message.error("Không thể lưu ghi chú. Vui lòng thử lại.");
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <div className="container-fulid m-3">
      <div className="row">
        <div className="col-2">
          {auth.membership ? (
            <Card className="d-flex flex-column h-100">
              <Title level={4}>Tag của tôi</Title>
              <Divider />
            </Card>
          ) : null}
        </div>
        <div className="col-7">
          {isLoading || pageNum === undefined ? (
            <Spin />
          ) : (
            <div className="d-flex flex-column gap-3 align-items-center">
              {
                !image ? <Spin /> : <Image
                  src={image}
                  alt="book content"
                  preview={false}
                  placeholder={<Spin />}
                />
              }
              <Pagination
                simple
                total={book?.PageCount}
                onChange={(page) => {
                  noteForm.resetFields();
                  setPage(page);
                }}
                pageSize={1}
                current={pageNum}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
        <div className="col-3">
          {auth.membership ? (
            <Card loading={noteLoading} title="Ghi chú của tôi">
              <Form form={noteForm} onFinish={saveNote}>
                <Form.Item name="detail">
                  <Input.TextArea />
                </Form.Item>
                <div className="mt-3">
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                </div>
              </Form>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BookReader;
