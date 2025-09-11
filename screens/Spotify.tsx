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

interface Props {
  navigation?: any;
}

const Spotify: React.FC<Props> = ({ navigation }) => {
  return (
    <LinearGradient colors={["#222222", "#000000"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../assets/spotify.jpg")}
          style={styles.logo}
          accessibilityLabel="Spotify logo"
        />
        <Text style={styles.title}>Spotify</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#888"
            style={styles.input}
            accessibilityLabel="Enter your username"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            accessibilityLabel="Enter your password"
          />
          <Text style={styles.forgot}>Forgot password?</Text>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation?.navigate("SpotifyHome")}
          >
            <Text style={styles.mainButtonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={[styles.or, styles.orGreen]}>Be Correct With</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialText}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialText}>G</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => navigation?.navigate("SpotifySignUp")}
          >
            <Text style={{ textAlign: "center", color: "#888" }}>
              Don’t have an account?{" "}
              <Text style={{ color: "#1DB954", fontWeight: "bold" }}>
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
    color: "#fff",
    marginBottom: 25,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  forgot: {
    color: "#888",
    textAlign: "right",
    marginBottom: 12,
  },
  mainButton: {
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
  },
  mainButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  or: {
    color: "#888",
    textAlign: "center",
    marginVertical: 15,
  },
  orGreen: {
    color: "#1DB954",
    fontWeight: "bold",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialBtn: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    color: "#fff",
    fontSize: 20,
  },
});
