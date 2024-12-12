import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { UserMembership } from "../../models/UserMembership";

interface Props {
  membership: UserMembership | null;
}

const MembershipCardInfo = (prop: Props) => {
  const { membership } = prop;
  const { Title, Text } = Typography;
  const navigate = useNavigate();

  return (
    <Card>
      <div className="d-flex flex-column gap-2 ">
        <Title level={3}>
          {membership?.membership.name ?? "Chưa đăng ký thành viên"}
        </Title>
        <Text type="secondary">{membership?.expireDate ?? "N/a"}</Text>
        {!membership && (
          <Button
            className="mt-2"
            type="primary"
            onClick={() => navigate(`/membership/subscribe`)}
          >
            Đăng ký gói thành viên
          </Button>
        )}
      </div>
    </Card>
  );
};

export default MembershipCardInfo;
