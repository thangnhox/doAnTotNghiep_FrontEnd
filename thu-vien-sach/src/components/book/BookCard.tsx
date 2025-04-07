import Book from "../../models/book/Book";
import { Button, Card, Image, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { numbericFormat } from "../../utils/numbericUtil";

interface Props {
  book: Book;
}

const BookCard = (props: Props) => {
  const { Title, BookID, Price, cover_url, PageCount } =
    props.book;
  const navigate = useNavigate();

  return (
    <Card
      title={<Typography.Title level={4}>{Title}</Typography.Title>}
      style={{
        width: 300,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="d-flex flex-column align-items-center">
        <Image
          src={cover_url}
          preview={false}
          width={150}
          height={200}
          style={{ borderRadius: 8 }}
        />

        <div className="mt-3 text-center">
          <Typography.Text className="d-block mb-1">
            <strong>Giá: </strong> {numbericFormat(Number(Price))} VND
          </Typography.Text>
          <Typography.Text>
            <strong>Số trang: </strong> {numbericFormat(Number(PageCount))}
          </Typography.Text>
        </div>

        <div className="d-flex flex-row gap-3 align-items-center justify-content-center mt-3">
          <Button
            type="primary"
            className="bg-success"
            onClick={() => navigate(`/books/${BookID}`)}
            style={{ borderRadius: 5 }}
          >
            Chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;
