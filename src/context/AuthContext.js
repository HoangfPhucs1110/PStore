import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy token từ localStorage khi load app
  useEffect(() => {
    const token = localStorage.getItem("pstore_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("pstore_token");
        delete api.defaults.headers.common.Authorization;
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("pstore_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(user);
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem("pstore_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("pstore_token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
