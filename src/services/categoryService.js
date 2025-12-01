import api from "../api/api";

export const categoryService = {
  getAll: async () => (await api.get("/categories")).data,
  create: async (data) => (await api.post("/categories", data)).data,
  update: async (id, data) => (await api.put(`/categories/${id}`, data)).data, // <--- THÊM
  delete: async (id) => (await api.delete(`/categories/${id}`)).data,
};