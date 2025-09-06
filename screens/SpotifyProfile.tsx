import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

type ProfileNav = NativeStackNavigationProp<RootStackParamList, "SpotifyProfile">;

const SpotifyProfile: React.FC = () => {
  const navigation = useNavigation<ProfileNav>();

  const user = {
    name: "Looweji",
    email: "21800570@usc.edu.ph",
    profilePic: require("../assets/rin.jpg"),
  };

  const handleEditProfile = () => {
    console.log("Edit profile pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("SpotifyHome")}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Profile 🎤</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.avatarWrapper}>
        <Image source={user.profilePic} style={styles.avatar} />
      </View>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpotifyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
    marginTop: 10,
  },
  backBtn: {
    color: "#1DB954",
    fontSize: 18,
    fontWeight: "600",
  },
  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  avatarWrapper: {
    marginBottom: 25,
    marginTop: 20,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#1DB954",
  },
  name: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    color: "#888",
    fontSize: 18,
    marginBottom: 40,
  },
  editBtn: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 35,
  },
  editBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
