// context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { themes, AppTheme } from "../theme/themes";

type ThemeContextType = {
  theme: AppTheme;
  themeName: keyof typeof themes;
  setTheme: (name: keyof typeof themes) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.spotify, // default
  themeName: "spotify",
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<keyof typeof themes>("spotify");

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[themeName],
        themeName,
        setTheme: setThemeName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
