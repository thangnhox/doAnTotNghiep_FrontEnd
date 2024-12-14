import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Category from "../../models/Category";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { handleAPI } from "../../remotes/apiHandle";
import { Button, Card, Divider, Empty, Image, Spin, Typography } from "antd";

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      setLoading(true);
      const res: AxiosResponse<ResponseDTO<Category>> = await handleAPI(
        `categories/fetch/${categoryId}?detail=true`
      );
      setCategory(res.data.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return isLoading ? (
    <Spin />
  ) : (
    <div className="d-flex flex-column gap-3 mt-3 ">
      {category?.booklist?.length === 0 ? (
        <Empty />
      ) : (
        <>
          <Typography.Title level={3}>{category?.name}</Typography.Title>
          <Divider />
          <div className="container">
            <div className="row">
              {category?.booklist?.map((book) => (
                <div className="col">
                  <Card
                    title={
                      <Typography.Title level={4}>
                        {book.title}
                      </Typography.Title>
                    }
                    style={{
                      width: 400,
                      borderRadius: 10,
                      overflow: "hidden",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="d-flex flex-column align-items-center">
                      <Image
                        src={book.coverUrl}
                        preview={false}
                        width={150}
                        height={200}
                        style={{ borderRadius: 8 }}
                      />

                      <div className="mt-3 text-center">
                        <Typography.Text className="d-block mb-1">
                          <strong>Giá: </strong> {book.price} VND
                        </Typography.Text>
                        <Typography.Text>
                          <strong>Số trang: </strong> {book.totalPage}
                        </Typography.Text>
                      </div>

                      <div className="d-flex flex-row gap-3 align-items-center justify-content-center mt-3">
                        <Button
                          type="primary"
                          className="bg-success"
                          onClick={() => navigate(`/books/${book.id}`)}
                          style={{ borderRadius: 5 }}
                        >
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryDetailPage;
