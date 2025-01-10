import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    // Load from localStorage or use initial client details
    const storedAuthData = localStorage.getItem("authData");

    return storedAuthData ? JSON.parse(storedAuthData) : JSON.parse(storedAuthData);
  });

  // Store authData in localStorage whenever it changes
  useEffect(() => {
    if (authData) {
      localStorage.setItem("authData", JSON.stringify(authData));
    }
  }, [authData]);

  return <AuthContext.Provider value={{ authData, setAuthData }}>{children}</AuthContext.Provider>;
};
