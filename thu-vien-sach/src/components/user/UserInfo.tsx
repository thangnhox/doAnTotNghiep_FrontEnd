import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Modal,
  Typography,
  Form,
  Input,
  DatePicker,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useState } from "react";
import { AxiosResponse } from "axios";
import { handleAPI } from "../../remotes/apiHandle";

interface Props {
  fullName: string;
  email: string;
  avatarUrl?: string;
  birthYear: string;
}

const UserInfo = (props: Props) => {
  const { fullName, email, avatarUrl, birthYear } = props;
  const { Text, Title } = Typography;
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [isOpenChangeUserInfoModal, setOpenChangeUserInfoModal] =
    useState<boolean>(false);
  const [form] = useForm();

  const onCancelModal = () => {
    form.resetFields();
    setOpenChangeUserInfoModal(false);
  };

  const onPerformEdit = async () => {
    try {
      setFormLoading(true);
      const name: string = form.getFieldValue("name");
      const birthYear: number = dayjs(form.getFieldValue("birthYear")).year();
      const reqInfo = {
        name,
        birthYear,
      };
      const res: AxiosResponse = await handleAPI(`user/update`, reqInfo, "put");
      if (res.status === 200) {
        message.success(`Cập nhật thông tin thành công`);
        form.resetFields();
        setOpenChangeUserInfoModal(false);
        window.location.reload();
      }
    } catch (error: any) {
      console.error(error);
      message.error(`Đã xảy ra lỗi! Vui lòng thử lại sau`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Card>
      <div className="d-flex flex-row gap-3 w-100 align-items-center ">
        {avatarUrl ? (
          <Avatar src={avatarUrl} size={75} />
        ) : (
          <Avatar icon={<UserOutlined />} size={75} />
        )}
        <div className="d-flex flex-column text-start gap-2 ">
          <Title level={4}>
            <strong>{fullName}</strong>
          </Title>
          <Text>
            <strong>Email</strong>: {email}
          </Text>
          <Text>
            <strong>Năm sinh</strong>: {birthYear}
          </Text>
          <Divider type="vertical" />
          <Button onClick={() => setOpenChangeUserInfoModal(true)}>
            Cập nhật
          </Button>
        </div>
      </div>
      <>
        <Modal
          title="Cập nhật thông tin người dùng"
          open={isOpenChangeUserInfoModal}
          closable={false}
          onCancel={onCancelModal}
          onOk={() => form.submit()}
          loading={formLoading}
        >
          <Form form={form} onFinish={onPerformEdit}>
            <Form.Item name="email" label="Email" initialValue={email}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="name" label="Tên" initialValue={fullName}>
              <Input />
            </Form.Item>
            <Form.Item name="birthYear" label="Năm sinh" initialValue={dayjs()}>
              <DatePicker />
            </Form.Item>
          </Form>
        </Modal>
      </>
    </Card>
  );
};

export default UserInfo;
