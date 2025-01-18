
import { Button, Card, Divider, Image, Progress, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { handleAPI } from "../../remotes/apiHandle";


interface Props {
  bookId: number;
  title: string;
  cover_url: string;
  description?: string;
  progress?: number;
  total?: number;
  action: "read" | "download"
}

const BookItem = (props: Props) => {
  const { bookId, description, title, cover_url, progress, total, action } = props;
  const navigate = useNavigate();

  console.log(bookId)

  const handleDownload = async () => {
    const res = await handleAPI(`books/download/${bookId}`, {}, "get", "blob")
    const pdfFileUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    let aTag = document.createElement("a");
    aTag.href = pdfFileUrl;
    aTag.setAttribute("download", title)
    document.body.append(aTag);
    aTag.click();
    aTag.remove();
  }

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
          <Button type="primary" onClick={async () => {
            if (action === "read") {
              navigate(`/books/${bookId}`)
            } else {
              handleDownload()
            }
          }}>
            {action === "read" ? "Đọc" : "Download"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BookItem;
