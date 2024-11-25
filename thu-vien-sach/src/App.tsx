import './App.css';
import MainRouter from './routes/MainRouter';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import store from './redux/reduxStore';

function App() {
  return (
    <div className="App">
      <ConfigProvider>
        <Provider store={store}>
        <MainRouter/>
        </Provider>
      </ConfigProvider>
    </div>
  );
}

export default App;
