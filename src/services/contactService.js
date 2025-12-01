import api from "../api/api";

export const contactService = {
  // User gửi liên hệ
  create: async (data) => (await api.post("/contacts", data)).data,

  // Admin lấy danh sách
  getAll: async () => (await api.get("/contacts")).data,

  // Admin xóa
  delete: async (id) => (await api.delete(`/contacts/${id}`)).data,

  // Admin phản hồi
  reply: async (id, replyMessage) => (await api.post(`/contacts/${id}/reply`, { replyMessage })).data,
};