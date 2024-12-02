import axios, { AxiosError, AxiosResponse } from "axios";
import queryString from "query-string";
import store from "../redux/reduxStore";

const baseURL = process.env.REACT_APP_BASE_URL ?? "http://localhost:3000";

export const getAccessToken = () => {
  let token = store.getState().auth.data.token;
  return token;
};

const axiosInstace = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "*",
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

const onRequest = (config: any) => {
  const token = getAccessToken();
  config.headers = {
    Authorization: token ? `Bearer ${token}` : "",
    Accept: "application/json",
    ...config.headers,
  };
  return { ...config, data: config.data ?? null };
};
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};
axiosInstace.interceptors.request.use(onRequest, onRequestError);
axiosInstace.interceptors.response.use(onResponse, onResponseError);

export default axiosInstace;
