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

const SpotifySignUp: React.FC<Props> = ({ navigation }) => {
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
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Spotify
        </Text>

        <View style={styles.form}>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor={theme.colors.textSecondary}
            style={[
              styles.input,
              { backgroundColor: theme.colors.card, color: theme.colors.text },
            ]}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Full Name"
            placeholderTextColor={theme.colors.textSecondary}
            style={[
              styles.input,
              { backgroundColor: theme.colors.card, color: theme.colors.text },
            ]}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            style={[
              styles.input,
              { backgroundColor: theme.colors.card, color: theme.colors.text },
            ]}
          />

          <View style={styles.row}>
            <Text style={[styles.labelGreen, { color: theme.colors.primary }]}>
              Date of Birth:
            </Text>
            <TextInput
              placeholder="DD"
              placeholderTextColor={theme.colors.textSecondary}
              style={[
                styles.input,
                styles.dateInput,
                { backgroundColor: theme.colors.card, color: theme.colors.text },
              ]}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="MM"
              placeholderTextColor={theme.colors.textSecondary}
              style={[
                styles.input,
                styles.dateInput,
                { backgroundColor: theme.colors.card, color: theme.colors.text },
              ]}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="YY"
              placeholderTextColor={theme.colors.textSecondary}
              style={[
                styles.input,
                styles.dateInput,
                { backgroundColor: theme.colors.card, color: theme.colors.text },
              ]}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.genderBtn, { backgroundColor: theme.colors.card }]}
            >
              <Text style={{ color: theme.colors.primary }}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, { backgroundColor: theme.colors.card }]}
            >
              <Text style={{ color: theme.colors.primary }}>Female</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.mainButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={[styles.or, { color: theme.colors.primary }]}>
            Sign up with
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
            onPress={() => navigation?.navigate("Spotify")}
          >
            <Text style={{ textAlign: "center", color: theme.colors.textSecondary }}>
              Already have an account?{" "}
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SpotifySignUp;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  logo: { width: 90, height: 90, marginBottom: 15, borderRadius: 50 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 25 },
  form: { width: "100%" },
  input: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 14,
  },
  dateInput: { flex: 1, marginHorizontal: 5 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  genderBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
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
  or: { textAlign: "center", marginVertical: 15, fontWeight: "bold" },
  socialRow: { flexDirection: "row", justifyContent: "center" },
  socialBtn: {
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: { fontSize: 20 },
  labelGreen: { marginTop: 10, marginBottom: 5 },
});
