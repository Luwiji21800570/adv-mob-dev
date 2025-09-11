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
import type { RootStackParamList } from "../App"; // adjust path if needed

type SettingsNav = NativeStackNavigationProp<RootStackParamList, "SpotifySettings">;

const SpotifySettings: React.FC = () => {
  const navigation = useNavigation<SettingsNav>();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    navigation.navigate("Spotify");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("SpotifyHome")}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Settings ⚙️</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={notificationsEnabled ? "#1DB954" : "#888"}
          trackColor={{ false: "#444", true: "#1DB954" }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          thumbColor={darkModeEnabled ? "#1DB954" : "#888"}
          trackColor={{ false: "#444", true: "#1DB954" }}
        />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpotifySettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    color: "#1DB954",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  settingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#1DB954",
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
