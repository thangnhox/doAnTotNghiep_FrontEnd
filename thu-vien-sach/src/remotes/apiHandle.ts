import axiosInstace from "./axiosConfig";

export const handleAPI = async (
  url: string,
  data?: any,
  method?: "get" | "put" | "post" | "delete"
) => {
  return await axiosInstace(url, {
    method: method ?? "get",
    data,
  });
};
