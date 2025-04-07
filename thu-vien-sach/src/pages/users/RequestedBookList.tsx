import { useEffect, useState } from "react";
import { RequestedBook } from "../../models/RequestedBook";
import { Button, Card, Form, Input, Modal, Table, TableProps } from "antd";
import { handleAPI } from "../../remotes/apiHandle";
import { useForm } from "antd/es/form/Form";

const RequestedBookList = () => {
  const [requestedBooks, setRequestedBooks] = useState<RequestedBook[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isModalLoading, setModalLoading] = useState<boolean>(false);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [requestBookForm] = useForm()
  const tableColumn: TableProps<RequestedBook>["columns"] = [
    {
      key: "title",
      title: "Tiêu đề",
      dataIndex: "title"
    },
    {
      key: "description",
      title: "Mô tả",
      dataIndex: "description"
    },
    {
      key: "status",
      title: "Trạng thái",
      dataIndex: "status",
      render: (value, record, index) => renderStatus(value)
    }
  ]

  useEffect(() => {
    getBookRequested();
  }, [])

  const renderStatus = (value: number) => {
    const statusMap: { [key: string]: string } = {
      "-1": "Từ chối",
      "0": "Đang chờ"
    };
    return statusMap[String(value)] || "Thành công";
  };

  const getBookRequested = async () => {
    try {
      setLoading(true);
      const res = await handleAPI(`books/requestedBooks`);
      setRequestedBooks(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch requested books:", error);
    } finally {
      setLoading(false);
    }
  };

  const performRequest = async () => {
    try {
      setModalLoading(true);
      const requestBook = requestBookForm.getFieldsValue();
      const res = await handleAPI(`books/makeBookRequest`, requestBook, 'post');
      if (res.status === 201) {
        getBookRequested();
      }
    } catch (error) {
      console.error("Failed to perform book request:", error);
    } finally {
      setModalLoading(false);
      setOpenModal(false);
      requestBookForm.resetFields();
    }
  };

  return <>
    <Card extra={
      <div className="d-flex flex-row justify-content-between" >
        <Button type="primary" onClick={() => setOpenModal(true)} >Yêu cầu sách</Button>
      </div >}
    >
      <Table 
        columns={tableColumn} 
        dataSource={requestedBooks} 
        loading={isLoading} 
      />
    </Card >
    <Modal title={"Yêu cầu thêm sách"} open={isOpenModal} closable={false} footer={<div className="d-flex flex-row justify-content-end gap-3 " >
      <Button type="primary" onClick={() => requestBookForm.submit()} loading={isModalLoading} >Yêu cầu</Button>
      <Button onClick={() => {
        setOpenModal(false);
        requestBookForm.resetFields();
      }} danger  >Đóng</Button>
    </div>} >
      <Form form={requestBookForm} layout="vertical" onFinish={performRequest} >
        <Form.Item label="Tiêu đề" name="title" rules={[
          { required: true, message: "Vui lòng nhập tiêu đề" },
          { min: 2, message: "Tiêu đề phải có ít nhất 2 ký tự" }
        ]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description" rules={[
          { required: true, message: "Vui lòng nhập mô tả" },
          { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" }
        ]}>
          <Input.TextArea />
        </Form.Item >
      </Form>
    </Modal>
  </>
};



export default RequestedBookList;
