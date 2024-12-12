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

const BookReader = () => {
  const { bookId } = useParams();
  const { Text, Title } = Typography;
  const [isLoading, setLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState<boolean>(false);
  const [pageNum, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<{
    [key: number]: string;
  }>({});
  const [note, setNote] = useState<Note | null>(null);
  const [noteForm] = useForm();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await handleAPI(`books/fetch/${bookId}`);
        setTotalPage(res.data.data.PageCount);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBookDetails();
  }, [bookId]);

  useEffect(() => {
    getContent();
    initNote();
    preloadImages(pageNum);
  }, [pageNum]);

  const getContent = async () => {
    if (preloadedImages[pageNum]) {
      setImage(preloadedImages[pageNum]);
      return;
    }

    try {
      setLoading(true);
      const res = await handleAPI(
        `/books/read/${bookId}?page=${pageNum}&width=1000&height=1000&density=200`,
        null,
        "get",
        "blob"
      );
      const blobUrl = URL.createObjectURL(res.data);
      setImage((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return blobUrl;
      });
      setPreloadedImages((prev) => ({ ...prev, [pageNum]: blobUrl }));
    } catch (error) {
      console.error("Error fetching page content:", error);
    } finally {
      setLoading(false);
    }
  };

  const preloadImages = async (currentPage: number) => {
    const pagesToPreload = [
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ].filter((page) => page > 0 && page <= totalPage);

    try {
      const promises = pagesToPreload.map(async (page) => {
        if (!preloadedImages[page]) {
          const res = await handleAPI(
            `/books/read/${bookId}?page=${page}&width=1000&height=1000&density=200`,
            null,
            "get",
            "blob"
          );
          return { page, url: URL.createObjectURL(res.data) };
        }
        return null;
      });

      const results = await Promise.all(promises);

      setPreloadedImages((prev) => {
        const updated = { ...prev };
        results.forEach((result) => {
          if (result) {
            updated[result.page] = result.url;
          }
        });
        return updated;
      });
    } catch (error) {
      console.error("Error preloading images:", error);
    }
  };

  const initNote = async () => {
    try {
      setNoteLoading(true);
      const res: AxiosResponse<ResponseDTO<Note>> = await handleAPI(
        `notes/search?booksId=${bookId}$page=${pageNum}&exact=false`
      );
      setNote(res.data.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setNoteLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      setNoteLoading(true);
      if (!note) {
        return;
      }
      const detail: string = noteForm.getFieldValue("detail");

      const newNote = {
        booksId: bookId,
        page: pageNum,
        detail,
      };

      const res: AxiosResponse<ResponseDTO<Note>> = await handleAPI(
        `notes/add`,
        newNote,
        "post"
      );
      if (res.status === 201 || res.status === 200) {
        message.success("Thêm ghi chú thành công");
        noteForm.resetFields();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <div className="container-fulid m-3">
      <div className="row">
        <div className="col-2">
          <Card className="d-flex flex-column h-100">
            <Title level={4}>Tag của tôi</Title>
            <Divider />
          </Card>
        </div>
        <div className="col-7">
          {isLoading ? (
            <Spin />
          ) : (
            <div className="d-flex flex-column gap-3 align-items-center">
              <Image
                src={image || ""}
                alt="book content"
                preview={false}
                placeholder={<Spin />}
              />
              <Pagination
                simple
                total={totalPage}
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
          <Card loading={noteLoading} title="Ghi chú của tôi">
            <div className="d-flex flex-column justify-content-between w-100">
              <Form form={noteForm} onFinish={saveNote}>
                <Form.Item name="detail" initialValue={note?.detail}>
                  <Input.TextArea />
                </Form.Item>
              </Form>
              <div className="mt-3">
                <Button type="primary" onClick={() => noteForm.submit()}>
                  Lưu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
