// src/lib/tokenManager.js
let currentToken = null;
const KEY = "token";

export const setToken = (token, remember = false) => {
  currentToken = token;

  // luôn clear storage trước
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);

  if (remember) {
    // chỉ khi remember=true mới persist vào localStorage
    localStorage.setItem(KEY, token);
  }
};

export const getToken = () => {
  // ưu tiên RAM
  if (currentToken) return currentToken;

  // fallback: nếu có trong localStorage (remember)
  const fromLocal = localStorage.getItem(KEY);
  if (fromLocal) {
    currentToken = fromLocal;
    return fromLocal;
  }

  return null;
};

export const clearToken = () => {
  currentToken = null;
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
};