import { isExpired, decodeToken } from "react-jwt";

export const validateToken = (token?: string): boolean => {
  if (token) {
    return !isExpired(token);
  }
  return false;
};


export const getUserEmail = (token: string) => {
  const enc_token = decodeToken(token);
}