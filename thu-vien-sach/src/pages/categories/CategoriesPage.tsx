import React, { useEffect, useState } from "react";
import Category from "../../models/Category";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { handleAPI } from "../../remotes/apiHandle";
import { Card, Divider, Spin, Typography, Button, List, Pagination } from "antd";
import { useNavigate } from "react-router-dom";

interface PageState {
  isLoading: boolean;
  categories: Category[];
  total: number;
  page: number;
  pageSize: number;
}

const CategoriesPage = () => {
  const [pageState, setPageState] = useState<PageState>({
    isLoading: false,
    categories: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getCategory(pageState.page, pageState.pageSize);
  }, [pageState.page, pageState.pageSize]);

  const getCategory = async (pageNum: number, pageSize: number) => {
    try {
      setPageState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      const res: AxiosResponse<ResponseDTO<Category[]>> = await handleAPI(
        `categories?page=${pageNum}&pageSize=${pageSize}`
      );
      setPageState((prev) => ({
        ...prev,
        categories: res.data.data,
        total: res.data.total ?? 0,
      }));
    } catch (error: any) {
      console.error("Error fetching categories:", error);
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
    <div className="d-flex flex-column gap-3">
      <Typography.Title level={2}>Thể loại</Typography.Title>
      <Divider />
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={pageState.categories}
        renderItem={(item: Category) => (
          <Card
            key={item.id}
            hoverable
            onClick={() => navigate(`/categories/${item.id}`)}
          >
            {item.name}
          </Card>
        )}
      />
      <Pagination
        className="mt-3"
        responsive={true}
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

export default CategoriesPage;
