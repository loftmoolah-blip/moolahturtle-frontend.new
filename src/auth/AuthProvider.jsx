import { createContext, useContext, useState } from "react";
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // TEMP: keep you logged in
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  return <Ctx.Provider value={{ isAuthenticated, login, logout }}>{children}</Ctx.Provider>;
};
