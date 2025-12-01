import api from "../api/api";

export const authService = {
  login: async (creds) => (await api.post("/auth/login", creds)).data,
  register: async (creds) => (await api.post("/auth/register", creds)).data,
  getMe: async () => (await api.get("/auth/me")).data,
  updateProfile: async (data) => (await api.put("/auth/profile", data)).data,
  uploadAvatar: async (formData) =>
    (await api.post("/auth/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data,
};