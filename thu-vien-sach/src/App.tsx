import "./App.css";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import store from "./redux/reduxStore";
import MainRouter from "./routes/MainRouter";

function App() {
  return (
    <div className="App">
      <ConfigProvider>
        <Provider store={store}>
          <MainRouter />
        </Provider>
      </ConfigProvider>
    </div>
  );
}

export default App;
