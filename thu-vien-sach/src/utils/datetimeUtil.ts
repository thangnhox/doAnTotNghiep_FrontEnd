import dayjs from "dayjs";

export const reFormatToDDMMYY = (date: string): string => {
  return dayjs(date).format("DD/MM/YYYY");
};
