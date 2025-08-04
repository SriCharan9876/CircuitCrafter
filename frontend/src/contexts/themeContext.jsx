import { useEffect, createContext, useState, useContext } from "react";

const ThemeContext = createContext();

const getTheme = () => {
  const theme = localStorage.getItem("theme");
  if (!theme) {
    // Default theme is taken as light-theme
    localStorage.setItem("theme", "light-theme");
    return "light-theme";
  } else {
    return theme;
  }
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getTheme);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "dark-theme" ? "light-theme" : "dark-theme"
    );
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme; // sets 'light' or 'dark' class
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
