import api from "../api/api";

export const reviewService = {

  getByProduct: async (pid) => (await api.get(`/reviews/products/${pid}/reviews`)).data,
  
  create: async (data) => (await api.post("/reviews", data)).data,
  
  delete: async (id) => (await api.delete(`/reviews/${id}`)).data,
  
  getAllAdmin: async () => (await api.get("/reviews/admin")).data,
  
  deleteAdmin: async (id) => (await api.delete(`/reviews/admin/${id}`)).data,
};