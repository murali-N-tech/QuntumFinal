// src/components/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a Context for the theme
const ThemeContext = createContext();

// Create a Provider component
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme. Default to 'auto'.
  // It reads the saved theme from localStorage on initial load.
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto');

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove old theme classes
    root.classList.remove('light', 'dark');

    let systemTheme = 'light';
    if (typeof window !== 'undefined') {
      systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    if (theme === 'auto') {
      root.classList.add(systemTheme);
      localStorage.setItem('theme', 'auto');
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);