import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    if (darkMode) {
      htmlElement.style.backgroundColor = "#0f172a";
      htmlElement.style.color = "#f1f5f9";
      bodyElement.style.backgroundColor = "#0f172a";
      bodyElement.style.color = "#f1f5f9";
      bodyElement.classList.add("dark-mode");
    } else {
      htmlElement.style.backgroundColor = "#ffffff";
      htmlElement.style.color = "#1e293b";
      bodyElement.style.backgroundColor = "#ffffff";
      bodyElement.style.color = "#1e293b";
      bodyElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = {
    darkMode,
    toggleDarkMode,
    colors: {
      background: darkMode ? "#0f172a" : "#ffffff",
      surface: darkMode ? "#1e293b" : "#ffffff",
      text: darkMode ? "#f1f5f9" : "#1e293b",
      textSecondary: darkMode ? "#cbd5e1" : "#64748b",
      border: darkMode ? "#334155" : "#e2e8f0",
      primary: darkMode ? "#60a5fa" : "#3b82f6",
      success: darkMode ? "#4ade80" : "#22c55e",
      warning: darkMode ? "#fbbf24" : "#f59e0b",
      error: darkMode ? "#f87171" : "#ef4444",
    },
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
