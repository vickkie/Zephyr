import React, { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocalStorage } from "../hooks/useLocalStorage";

const FloatingThemeToggler = () => {
  const lightmode = "lightmode";
  const darkmode = "darkmode";

  const [storedValue, setStoredValue] = useLocalStorage("themeMode", "darkmode");

  const toggleTheme = () => {
    setStoredValue(storedValue === darkmode ? lightmode : darkmode);

    const element = document.querySelector(".body");
    if (storedValue === darkmode) {
      element.classList.add(lightmode);
      element.classList.remove(darkmode);
    } else if (storedValue === lightmode) {
      element.classList.remove(lightmode);
      element.classList.add(darkmode);
    }
  };

  useEffect(() => {
    const element = document.querySelector(".body");
    if (storedValue === lightmode) {
      element.classList.add(lightmode);
      element.classList.remove(darkmode);
    } else if (storedValue === darkmode) {
      element.classList.remove(lightmode);
      element.classList.add(darkmode);
    }
  }, [storedValue]);

  return (
    <button
      className="theme-toggler"
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "70px",
        right: "20px",
        background: storedValue === darkmode ? "#fff" : "#333",
        color: storedValue === darkmode ? "#000" : "#fff",
        border: "none",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        zIndex: 1000,
      }}
      aria-label="Toggle Theme"
    >
      {storedValue === darkmode ? "🌞" : "🌙"}
    </button>
  );
};

export default FloatingThemeToggler;
