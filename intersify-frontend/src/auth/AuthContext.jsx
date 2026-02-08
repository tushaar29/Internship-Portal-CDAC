import { createContext, useContext, useState } from "react";
import { decodeToken } from "../utils/jwtUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = decodeToken(token);
    return {
      token,
      userId: decoded?.userId,
      role: decoded?.role,
    };
  });

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = decodeToken(token);
    setAuth({
      token,
      userId: decoded.userId,
      role: decoded.role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
