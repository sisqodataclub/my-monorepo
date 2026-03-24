import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;
        setIsAuthenticated(!isExpired);
      } catch {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
