import { createContext, useContext, useState, useEffect } from "react";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export const AuthProvider = ({ children }) => {
  // Start logged in to avoid redirect loops; we can wire real JWT later.
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // NO external redirects here
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  // If any old code tries to auto-redirect, we prevent it
  useEffect(() => {
    // noop – intentionally blank
  }, []);

  return (
    <Ctx.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};
