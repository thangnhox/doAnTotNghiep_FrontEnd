import React, { useEffect, useState } from "react";
import Author from "../../models/Author";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { handleAPI } from "../../remotes/apiHandle";
import {
  Button,
  Card,
  Divider,
  Image,
  List,
  Pagination,
  Spin,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { AppConstants } from "../../appConstants";

interface PageState {
  isLoading: boolean;
  authors: Author[];
  total: number;
  page: number;
  pageSize: number;
}

const AuthorsPage = () => {
  const [pageState, setPageState] = useState<PageState>({
    isLoading: false,
    authors: [],
    total: 0,
    page: 1,
    pageSize: 12,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getAuthors(pageState.page, pageState.pageSize);
  }, [pageState.page, pageState.pageSize]);

  const getAuthors = async (pageNum: number, pageSize: number) => {
    try {
      setPageState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      const res: AxiosResponse<ResponseDTO<Author[]>> = await handleAPI(
        `authors?page=${pageNum}&pageSize=${pageSize}`
      );
      setPageState((prev) => ({
        ...prev,
        total: res.data.total ?? 0,
        authors: res.data.data,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setPageState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return pageState.isLoading ? (
    <Spin />
  ) : (
    <div className="d-flex flex-column gap-3 mt-3">
      <Typography.Title>Tác giả</Typography.Title>
      <Divider />
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={pageState.authors}
        renderItem={(item: Author) => (
          <Card
            title={item.name}
            extra={
              <Button
                type="primary"
                onClick={() => navigate(`/authors/${item.id}`)}
              >
                Chi tiết
              </Button>
            }
          >
            <div className="d-flex flex-column gap-2">
              <Image
                src={item.avatar ?? AppConstants.images.defaultAvatar}
                style={{ borderRadius: "8px" }}
                preview={false}
              />
              <Typography.Text type="secondary">
                {item.birthDate}
              </Typography.Text>
              <Typography.Text>{item.nationality ?? "N/a"}</Typography.Text>
            </div>
          </Card>
        )}
      />
      <Pagination
        className="mt-3"
        align="center"
        responsive={true}
        simple
        pageSize={pageState.pageSize}
        current={pageState.page}
        total={pageState.total}
        onChange={(page, pageSize) =>
          setPageState((prev) => ({ ...prev, page: page, pageSize }))
        }
      />
    </div>
  );
};

export default AuthorsPage;
