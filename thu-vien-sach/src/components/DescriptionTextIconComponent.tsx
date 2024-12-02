import { Typography } from "antd";

interface Props {
  title: string;
  icon?: React.ReactNode;
  content?: string;
}

const DescriptionTextIconComponent = (props: Props) => {
  const { title, icon, content } = props;
  return (
    <div
      className="d-flex flex-column align-items-center gap-1 border p-3 rounded"
      style={{ maxHeight: "70px" }}
    >
      {icon ?? content}
      <Typography.Text>{title}</Typography.Text>
    </div>
  );
};

export default DescriptionTextIconComponent;
