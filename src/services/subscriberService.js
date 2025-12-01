import api from "../api/api";

export const subscriberService = {
  // Khách đăng ký
  subscribe: async (email) => {
    const res = await api.post("/subscribers", { email });
    return res.data;
  },

  // Khách hủy đăng ký (qua link email)
  unsubscribe: async (email) => {
    const res = await api.post("/subscribers/unsubscribe", { email });
    return res.data;
  },

  // Admin: Lấy danh sách
  getAll: async () => {
    const res = await api.get("/subscribers");
    return res.data;
  },

  // Admin: Xóa email
  delete: async (id) => {
    const res = await api.delete(`/subscribers/${id}`);
    return res.data;
  }
};