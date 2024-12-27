import { Button, Divider, Image, Input, Select } from "antd";
import { Header } from "antd/es/layout/layout";
import { useState } from "react";
import { authState, AuthState } from "../redux/authSlice";
import { useSelector } from "react-redux";
import UserTool from "./UserTool";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { ResponseDTO } from "../dtos/ResponseDTO";
import Book from "../models/book/Book";
import { debounceSearch } from "../utils/debouce";
import { handleAPI } from "../remotes/apiHandle";


const HeaderComponent = () => {
  const auth: AuthState = useSelector(authState);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedBooks, setSearchedBooksSet] = useState<Book[]>([]);
  const navigate = useNavigate();


  const handleSearch = async (title: string) => {
    console.log("Searching");
    setLoading(true)
    if (!title.trim()) {
      return;
    }
    try {
      const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(
        `books/search?title=${title}&field=Title,AuthorName`
      );
      setSearchedBooksSet(res.data.data);
    } catch (error: any) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  };



  return (
    <Header className="d-flex flex-row justify-content-between align-items-center bg-white shadow-sm rounded">
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/thu-vien-sach-truc-tuyen.firebasestorage.app/o/avatar%2Flogo.png?alt=media&token=a39fe59b-8fde-40db-b228-6c66284dda6d"
        width={60}
        preview={false}
        onClick={() => navigate("/")}
      />
      <div className="d-flex flex-row align-items-center gap-3">
        <Select
          suffixIcon={null}
          showSearch
          placeholder={"Nhập tên sách"}
          defaultActiveFirstOption={false}
          notFoundContent={"Không tìm thấy"}
          loading={loading}
          optionFilterProp="label"
          onSearch={debounceSearch(handleSearch, 1000)}
          value={searchedBooks}
          onSelect={(val) => {
            navigate(`/books/${val}`);
            setSearchedBooksSet([]);
          }}
          style={{ width: 500 }}
          options={(searchedBooks || []).map((book: Book) => ({
            value: book.BookID,
            label: book.Title,
          }))}
        />

        <Divider type="vertical" />

        {!auth.token ? (
          <div className="d-flex gap-2 align-items-center">
            <Button
              type="primary"
              className="bg-warning"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </Button>
            <Button type="primary" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
          </div>
        ) : (
          <UserTool />
        )}
      </div>
    </Header>
  );
};

export default HeaderComponent;
