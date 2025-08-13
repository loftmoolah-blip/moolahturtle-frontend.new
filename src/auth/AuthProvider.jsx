import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/api/client";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/auth/me");
      setUser(data);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore errors during logout
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  return (
    <Ctx.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};
