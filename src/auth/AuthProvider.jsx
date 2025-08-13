import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/api/client";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

    apiClient
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setLoading(true);
    try {
      if (userData) {
        setUser(userData);
      } else {
        const { data } = await apiClient.get("/auth/me");
        setUser(data);
      }
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, [logout]);

  return (
    <Ctx.Provider value={{ isAuthenticated, user, token, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};
