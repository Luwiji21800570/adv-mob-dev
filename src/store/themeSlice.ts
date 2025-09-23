import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeType = "light" | "dark" | "custom";

interface ThemeState {
  mode: ThemeType;
  accentColor: string;
}

const initialState: ThemeState = {
  mode: "light",
  accentColor: "#1DB954", // Spotify green
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.mode = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
  },
});

export const { setTheme, setAccentColor } = themeSlice.actions;
export default themeSlice.reducer;
