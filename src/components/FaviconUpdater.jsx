import { useEffect } from "react";

const FaviconUpdater = () => {
  useEffect(() => {
    const updateFavicon = () => {
      const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let favicon = document.querySelector("link[rel='icon']");

      if (!favicon) {
        // Create the favicon element if it doesn’t exist
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/svg+xml";
        document.head.appendChild(favicon);
      }

      // Update favicon based on dark/light mode
      favicon.href = darkMode ? "/svg/zephir-white.svg" : "/svg/zephir-black.svg";
    };

    updateFavicon(); // Run on mount

    // Listen for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateFavicon);

    return () => {
      mediaQuery.removeEventListener("change", updateFavicon);
    };
  }, []);

  return null; // No UI output, just runs the effect
};

export default FaviconUpdater;
