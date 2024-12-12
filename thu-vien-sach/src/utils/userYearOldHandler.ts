import dayjs from "dayjs";

export const isUserYearOldValidated = (
  bookRank: number,
  userBirthYear: string
) => {
  const yearOld = dayjs().year() - Number.parseInt(userBirthYear);
  if (bookRank === 2 && yearOld < 6) {
    return false;
  }
  if (bookRank === 3 && yearOld < 11) {
    return false;
  }
  if (bookRank === 4 && yearOld < 18) {
    return false;
  }
  return true;
};
