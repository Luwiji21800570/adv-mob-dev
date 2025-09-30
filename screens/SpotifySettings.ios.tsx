import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../src/store";
import { setTheme } from "../src/store/themeSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes } from "../theme/themes";

type SettingsNav = NativeStackNavigationProp<
  RootStackParamList,
  "SpotifySettings"
>;

const SpotifySettings: React.FC = () => {
  const navigation = useNavigation<SettingsNav>();
  const dispatch = useDispatch();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = themes[mode];

  const handleLogout = () => {
    navigation.navigate("Spotify");
  };

  // 🔹 save theme choice + dispatch
  const handleThemeChange = async (newMode: keyof typeof themes) => {
    dispatch(setTheme(newMode));
    try {
      await AsyncStorage.setItem("themeMode", newMode);
    } catch (e) {
      console.warn("Failed to save theme:", e);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("SpotifyHome")}>
          <Text style={[styles.backBtn, { color: theme.colors.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.header, { color: theme.colors.text }]}>
          Settings ⚙️
        </Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Notifications */}
      <View
        style={[
          styles.settingRow,
          { backgroundColor: theme.colors.card },
        ]}
      >
        <Text style={[styles.settingText, { color: theme.colors.text }]}>
          Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={notificationsEnabled ? theme.colors.primary : "#888"}
          trackColor={{ false: "#444", true: theme.colors.primary }}
        />
      </View>

      {/* Theme Selector */}
      <View
        style={[
          styles.settingRow,
          {
            backgroundColor: theme.colors.card,
            flexDirection: "column",
            alignItems: "center",
            paddingVertical: 20,
          },
        ]}
      >
        <Text
          style={[
            styles.settingText,
            { color: theme.colors.text, fontSize: 18, fontWeight: "700" },
          ]}
        >
          Theme
        </Text>

        <View
          style={{
            height: 2,
            backgroundColor: theme.colors.primary,
            width: "40%",
            marginVertical: 10,
            borderRadius: 2,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {Object.keys(themes).map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.themeButton,
                mode === m && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => handleThemeChange(m as keyof typeof themes)}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  { color: mode === m ? "#000" : "#fff" },
                ]}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.colors.primary }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpotifySettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    top: 25,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  themeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#333",
    minWidth: 80,
    alignItems: "center",
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  logoutBtn: {
    marginTop: 40,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
