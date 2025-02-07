import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocalStorage } from "../hooks/useLocalStorage";

const FloatingThemeToggler = () => {
  const lightmode = "lightmode";
  const darkmode = "darkmode";

  const [storedValue, setStoredValue] = useLocalStorage("themeMode", "darkmode");
  const [isSystemDarkMode, setIsSystemDarkMode] = useState(false);

  useEffect(() => {
    // Detect system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const prefersDarkMode = mediaQuery.matches;

    setIsSystemDarkMode(prefersDarkMode);

    // If no preference was set before, use the system preference
    if (!storedValue && prefersDarkMode) {
      setStoredValue(darkmode);
    }
  }, [storedValue]);

  const toggleTheme = () => {
    const newTheme = storedValue === darkmode ? lightmode : darkmode;
    setStoredValue(newTheme);

    const element = document.querySelector(".body");
    if (newTheme === lightmode) {
      element.classList.add(lightmode);
      element.classList.remove(darkmode);
    } else if (newTheme === darkmode) {
      element.classList.remove(lightmode);
      element.classList.add(darkmode);
    }
  };

  useEffect(() => {
    const element = document.querySelector(".body");
    if (isSystemDarkMode) {
      element.classList.add(darkmode);
      element.classList.remove(lightmode);
    } else {
      element.classList.remove(darkmode);
      element.classList.add(lightmode);
    }
  }, [isSystemDarkMode]);

  return (
    <button
      className="theme-toggler"
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "20%",
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
