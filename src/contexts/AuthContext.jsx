import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    // Load from localStorage or use initial client details. Guard against
    // corrupted/unparseable storage so a bad value can't crash the app on load.
    const storedAuthData = localStorage.getItem("authData");
    if (!storedAuthData) return null;
    try {
      return JSON.parse(storedAuthData);
    } catch {
      localStorage.removeItem("authData");
      return null;
    }
  });

  // Store authData in localStorage whenever it changes
  useEffect(() => {
    if (authData) {
      localStorage.setItem("authData", JSON.stringify(authData));
    }
  }, [authData]);

  return <AuthContext.Provider value={{ authData, setAuthData }}>{children}</AuthContext.Provider>;
};
