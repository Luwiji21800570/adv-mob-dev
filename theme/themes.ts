// theme/themes.ts
export type AppTheme = {
  colors: {
    background: string;
    text: string;
    primary: string;
    card: string;
  };
};

export const themes: Record<string, AppTheme> = {
  light: {
    colors: {
      background: "#ffffff",
      text: "#000000",
      primary: "#1DB954",
      card: "#f2f2f2",
    },
  },
  dark: {
    colors: {
      background: "#000000",
      text: "#ffffff",
      primary: "#1DB954",
      card: "#1c1c1c",
    },
  },
  spotify: {
    colors: {
      background: "#121212",
      text: "#ffffff",
      primary: "#1DB954",
      card: "#282828",
    },
  },
  ocean: {
    colors: {
      background: "#e6f2fa",
      text: "#00334d",
      primary: "#2596be",
      card: "#cce9f5",
    },
  },
  sunset: {
    colors: {
      background: "#fff4e6",
      text: "#4d2600",
      primary: "#ff914d",
      card: "#ffd9b3",
    },
  },
  forest: {
    colors: {
      background: "#f1f8f4",
      text: "#0d3b24",
      primary: "#2ecc71",
      card: "#d9f2e6",
    },
  },
  blue: {
    colors: {
      background: "#e6f4f9",
      text: "#0a1a2f",
      primary: "#2596be", // ✅ requested color
      card: "#cde7f5",
    },
  },
};
