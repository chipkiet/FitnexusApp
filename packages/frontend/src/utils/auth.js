import { getTokens } from "../lib/tokenManager.js";

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};