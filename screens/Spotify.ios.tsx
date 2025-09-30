import React from "react";
import LinearGradient from "react-native-linear-gradient";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../src/store";
import { themes } from "../theme/themes.ts";

interface Props {
  navigation?: any;
}

const Spotify: React.FC<Props> = ({ navigation }) => {
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = themes[mode];

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.background]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../assets/spotify.jpg")}
          style={styles.logo}
          accessibilityLabel="Spotify logo"
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>Spotify</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Username"
            placeholderTextColor={theme.colors.textSecondary}
            style={[
              styles.input,
              { backgroundColor: theme.colors.card, color: theme.colors.text },
            ]}
            accessibilityLabel="Enter your username"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            style={[
              styles.input,
              { backgroundColor: theme.colors.card, color: theme.colors.text },
            ]}
            accessibilityLabel="Enter your password"
          />
          <Text style={[styles.forgot, { color: theme.colors.textSecondary }]}>
            Forgot password?
          </Text>

          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation?.navigate("SpotifyHome")}
          >
            <Text style={styles.mainButtonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={[styles.or, { color: theme.colors.primary }]}>
            Be Correct With
          </Text>
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.socialText, { color: theme.colors.text }]}>
                f
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.socialText, { color: theme.colors.text }]}>
                G
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => navigation?.navigate("SpotifySignUp")}
          >
            <Text style={{ textAlign: "center", color: theme.colors.textSecondary }}>
              Don’t have an account?{" "}
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Spotify;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 15,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  form: {
    width: "100%",
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 14,
  },
  forgot: {
    textAlign: "right",
    marginBottom: 12,
  },
  mainButton: {
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
  },
  mainButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff", // keep white for contrast
    fontSize: 16,
  },
  or: {
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "bold",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialBtn: {
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    fontSize: 20,
  },
});
