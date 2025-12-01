import api from "../api/api";

const getSid = () => {
  let sid = localStorage.getItem("pstore_sid");
  if (!sid) {
    sid = Math.random().toString(36).substring(2);
    localStorage.setItem("pstore_sid", sid);
  }
  return sid;
};

export const cartService = {
  getCart: async () => (await api.get("/cart", { headers: { "x-session-id": getSid() } })).data,
  syncCart: async (items) => (await api.post("/cart", { items }, { headers: { "x-session-id": getSid() } })).data,
};