import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Đảm bảo Backend chạy port 5000
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
      // Token hết hạn -> Auto logout (tùy chọn)
      // localStorage.removeItem("pstore_token");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;