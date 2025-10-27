import "react-native-reanimated";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { store } from "./src/store";
import { setTheme, setAccentColor } from "./src/store/themeSlice";

// Screens
import HomeScreen from "./screens/HomeScreen";
import Spotify from "./screens/Spotify";
import SpotifyHome from "./screens/SpotifyHome";
import SpotifyProfile from "./screens/SpotifyProfile";
import SpotifySettings from "./screens/SpotifySettings";
import SpotifySignUp from "./screens/SpotifySignUp";
import PlaylistScreen from "./screens/PlaylistScreen";
import CameraScreen from "./screens/CameraScreen";
import MapScreen from "./screens/MapScreen";
import PokemonList from "./screens/PokemonList"; // 👈 NEW

export type RootStackParamList = {
  HomeScreen: undefined;
  Spotify: undefined;
  SpotifyHome: undefined;
  SpotifyProfile: undefined;
  SpotifySettings: undefined;
  SpotifySignUp: undefined;
  Playlist: { playlist: any };
  Camera: undefined;
  Map: undefined;
  PokemonList: undefined; // 👈 NEW
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function ThemeLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem("themeMode");
        const savedColor = await AsyncStorage.getItem("accentColor");

        if (savedMode) dispatch(setTheme(savedMode as any));
        if (savedColor) dispatch(setAccentColor(savedColor));
      } catch (e) {
        console.warn("Failed to load theme:", e);
      }
    };
    loadTheme();
  }, [dispatch]);

  return <>{children}</>;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeLoader>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen">
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Spotify"
                component={Spotify}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SpotifyHome"
                component={SpotifyHome}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SpotifyProfile"
                component={SpotifyProfile}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SpotifySettings"
                component={SpotifySettings}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SpotifySignUp"
                component={SpotifySignUp}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Playlist"
                component={PlaylistScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Camera"
                component={CameraScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Map"
                component={MapScreen}
                options={{ headerShown: false }}
              />
              {/* 👇 NEW SCREEN */}
              <Stack.Screen
                name="PokemonList"
                component={PokemonList}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeLoader>
      </Provider>
    </GestureHandlerRootView>
  );
}
