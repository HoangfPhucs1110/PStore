import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("pstore_token");
      if (!token) { setLoading(false); return; }
      try {
        const u = await authService.getMe();
        setUser(u);
      } catch {
        localStorage.removeItem("pstore_token");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem("pstore_token", data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    localStorage.setItem("pstore_token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("pstore_token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);