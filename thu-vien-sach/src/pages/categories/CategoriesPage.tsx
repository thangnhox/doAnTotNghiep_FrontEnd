import React, { useEffect, useState } from "react";
import Category from "../../models/Category";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { handleAPI } from "../../remotes/apiHandle";
import { Card, Divider, Spin, Typography } from "antd";
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
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      setPageState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      const res: AxiosResponse<ResponseDTO<Category[]>> = await handleAPI(
        `categories/`
      );
      setPageState((prev) => ({
        ...prev,
        categories: res.data.data,
        total: res.data.total ?? 0,
        pageSize: res.data.pageSize ?? 0,
        page: res.data.page ?? 1,
      }));
    } catch (error: any) {
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
    <div className="d-flex flex-column gap-3">
      <Typography.Title level={2}>Thể loại</Typography.Title>
      <Divider />
      <div className="d-flex flex-row gap-3">
        {pageState.categories.map((item) => (
          <Card
            key={item.id}
            hoverable
            onClick={() => navigate(`/categories/${item.id}`)}
          >
            {item.name}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
