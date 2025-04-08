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
import { useEffect, useState, useCallback } from "react";
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
  const [, setPreloadedImages] = useState<Record<number, string>>({});
  const [note, setNote] = useState<Note | null>(null);
  const [noteForm] = useForm();

  const fetchBookDetails = useCallback(async () => {
    try {
      const res = await handleAPI(`books/fetch/${bookId}`);
      setBook(res.data.data);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  }, [bookId]);

  const getLastPageRead = useCallback(async () => {
    try {
      const res: AxiosResponse<ResponseDTO<BookReadHistory>> =
        await handleAPI(`history/get/${bookId}`);
      setPage(res.data.data.LastRead || 1);
    } catch (error) {
      console.error("Error getting last page read:", error);
      setPage(1);
    }
  }, [bookId]);

  const getContent = useCallback(
    async (pageNum: number) => {
      // Use the updater function to check if the page is already preloaded
      let cachedImage: string | undefined;
      setPreloadedImages((prev) => {
        cachedImage = prev[pageNum];
        return prev; // Return the current state without modifying it
      });

      if (cachedImage) {
        setImage(cachedImage); // Use the cached image
        return;
      }

      try {
        const res = await handleAPI(
          `/books/read/${bookId}?page=${pageNum}&width=1000&height=1000&density=200`,
          null,
          "get",
          "blob"
        );
        const blobUrl = URL.createObjectURL(res.data);
        setImage(blobUrl);
        setPreloadedImages((prev) => ({ ...prev, [pageNum]: blobUrl }));
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    },
    [bookId] // Removed preloadedImages from the dependency array
  );

  const preloadImages = useCallback(
    async (currentPage: number) => {
      if (!book) return;

      const pagesToPreload = [currentPage - 1, currentPage, currentPage + 1].filter(
        (page) => page > 0 && page <= book.PageCount
      );

      try {
        const results = await Promise.all(
          pagesToPreload.map(async (page) => {
            // Use the updater function to check if the page is already preloaded
            let isAlreadyPreloaded = false;
            setPreloadedImages((prev) => {
              isAlreadyPreloaded = !!prev[page];
              return prev; // Return the current state without modifying it
            });

            if (!isAlreadyPreloaded) {
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
          })
        );

        setPreloadedImages((prev) => {
          const updated = { ...prev };
          results.forEach((result) => {
            if (result) updated[result.page] = result.url;
          });
          return updated;
        });
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    },
    [book, bookId] // Removed preloadedImages from the dependency array
  );

  const updateReadingHistory = useCallback(async (pageNum: number) => {
    try {
      await handleAPI(`history/update/${bookId}/${pageNum}`);
    } catch (error) {
      console.error("Error updating reading history:", error);
    }
  }, [bookId]);

  const loadNote = useCallback(async () => {
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
  }, [bookId, pageNum, noteForm]);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([getContent(pageNum!), updateReadingHistory(pageNum!), loadNote()]);
      preloadImages(pageNum!);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [pageNum, getContent, updateReadingHistory, loadNote, preloadImages]);

  useEffect(() => {
    fetchBookDetails();
    getLastPageRead();
  }, [fetchBookDetails, getLastPageRead]);

  useEffect(() => {
    if (pageNum) {
      getData();
    }
  }, [pageNum, getData]);

  const saveNote = useCallback(async () => {
    try {
      setNoteLoading(true);
      const detail: string = noteForm.getFieldValue("detail").trim();

      if (!detail) {
        message.warning("Ghi chú không được để trống.");
        return;
      }

      const notePayload = { booksId: bookId, page: pageNum, detail };
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
  }, [bookId, pageNum, note, noteForm]);

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
