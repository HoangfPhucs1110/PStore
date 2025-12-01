import api from "../api/api";

export const orderService = {
  // Tạo đơn
  create: async (data) => (await api.post("/orders", data)).data,
  
  // Lấy đơn của tôi
  getMyOrders: async () => (await api.get("/orders/my")).data,
  
  // Admin lấy tất cả
  getAll: async () => (await api.get("/orders")).data,
  
  // Cập nhật trạng thái
  updateStatus: async (id, status) => (await api.put(`/orders/${id}/status`, { status })).data,
  
  // Xóa đơn
  delete: async (id) => (await api.delete(`/orders/${id}`)).data,
  
  // Thanh toán PayOS
  createPaymentLink: async (data) => (await api.post("/payment/create-payment-link", data)).data,
  getPaymentInfo: async (orderCode) => (await api.post("/payment/get-payment-info", { orderCode })).data,
  
  // --- TRA CỨU ĐƠN HÀNG (MỚI) ---
  lookup: async (phone, orderCode) => (await api.post("/orders/lookup", { phone, orderCode })).data,
};