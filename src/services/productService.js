import api from "../api/api";

export const productService = {
  getAll: async (params) => (await api.get("/products", { params })).data,
  getBySlug: async (slug) => (await api.get(`/products/slug/${slug}`)).data,
  getById: async (id) => (await api.get(`/products/${id}`)).data,
  create: async (data) => (await api.post("/products", data)).data,
  update: async (id, data) => (await api.put(`/products/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/products/${id}`)).data,
  uploadImage: async (formData) =>
    (await api.post("/products/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data,
};