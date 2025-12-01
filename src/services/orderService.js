import api from "../api/api";

export const orderService = {
  create: async (data) => (await api.post("/orders", data)).data,
  getMyOrders: async () => (await api.get("/orders/my")).data,
  // Admin
  getAll: async () => (await api.get("/orders")).data,
  updateStatus: async (id, status) => (await api.put(`/orders/${id}/status`, { status })).data,
  // Thêm hàm này: User tự hủy đơn
  cancel: async (id) => (await api.put(`/orders/${id}/cancel`)).data, 
  delete: async (id) => (await api.delete(`/orders/${id}`)).data,
};