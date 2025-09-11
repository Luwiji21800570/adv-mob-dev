import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import Spotify from "./screens/Spotify";
import SpotifyHome from "./screens/SpotifyHome";
import SpotifyProfile from "./screens/SpotifyProfile";
import SpotifySettings from "./screens/SpotifySettings";
import SpotifySignUp from "./screens/SpotifySignUp";
import PlaylistScreen from "./screens/PlaylistScreen";

export type RootStackParamList = {
  HomeScreen: undefined;
  Spotify: undefined;
  SpotifyHome: undefined;
  SpotifyProfile: undefined;
  SpotifySettings: undefined;
  SpotifySignUp: undefined;
  Playlist: { playlist: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
