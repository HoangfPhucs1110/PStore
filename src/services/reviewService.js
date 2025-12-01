import api from "../api/api";

export const reviewService = {
  getByProduct: async (pid) => (await api.get(`/products/${pid}/reviews`)).data,
  create: async (data) => (await api.post("/reviews", data)).data,
  delete: async (id) => (await api.delete(`/reviews/${id}`)).data,
  // Admin
  getAllAdmin: async () => (await api.get("/admin/reviews")).data,
  deleteAdmin: async (id) => (await api.delete(`/admin/reviews/${id}`)).data,
};