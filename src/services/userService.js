import api from "../api/api";

export const userService = {
  // Admin only
  getAll: async () => (await api.get("/users")).data, // Backend route mới là /api/users
  updateStatus: async (id, data) => (await api.patch(`/users/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/users/${id}`)).data,
};