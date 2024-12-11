import axiosInstace from "./axiosConfig";

export const handleAPI = async (
  url: string,
  data?: any,
  method?: "get" | "put" | "post" | "delete",
  responseType?: "json" | "blob"
) => {
  return await axiosInstace(url, {
    method: method ?? "get",
    data,
    responseType: responseType ?? "json",
  });
};
