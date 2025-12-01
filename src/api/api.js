import axios from "axios";

// Sử dụng biến môi trường, nếu không có (lúc chạy local) thì dùng localhost
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pstore_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("pstore_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;