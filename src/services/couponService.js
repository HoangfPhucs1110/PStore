import api from "../api/api";

export const couponService = {
  getAll: async () => (await api.get("/coupons")).data,
  create: async (data) => (await api.post("/coupons", data)).data,
  update: async (id, data) => (await api.put(`/coupons/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/coupons/${id}`)).data,
  apply: async (code, orderTotal) => (await api.post("/coupons/apply", { code, orderTotal })).data,
};