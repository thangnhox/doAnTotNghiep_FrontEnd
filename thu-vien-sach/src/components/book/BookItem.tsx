import React from "react";
import Book from "../../models/book/Book";
import { Button, Card, Divider, Image, List, Progress, Typography } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  bookId: number;
  title: string;
  cover_url: string;
  description?: string;
  progress?: number;
  total?: number;
}

const BookItem = (props: Props) => {
  const { bookId, description, title, cover_url, progress, total } = props;
  const navigate = useNavigate();
  return (
    <Card>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row gap-3 align-items-center text-start ">
          <Image
            preview={false}
            src={cover_url}
            width={75}
            className="bordered"
          />
          <Divider type="vertical" />
          <div className="d-flex flex-column align-items-center">
            <Typography.Title level={4}>{title}</Typography.Title>
            {description && <Typography.Text>{description}</Typography.Text>}
          </div>
        </div>
        <div className="d-flex flex-row gap-3 align-items-center">
          {progress && total && (
            <Progress
              type="circle"
              size={"small"}
              percent={Number.parseInt(((progress / total) * 100).toFixed())}
              status="active"
            />
          )}
          <Button type="primary" onClick={() => navigate(`/books/${bookId}`)}>
            Đọc
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BookItem;
