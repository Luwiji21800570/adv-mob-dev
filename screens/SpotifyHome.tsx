import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App"; // 👈 adjust import path if needed

const playlists = [
  { id: 1, title: "Top Hits", image: require("../assets/spotifyTopHits.jpg") },
  { id: 2, title: "Chill Vibes", image: require("../assets/spotifyChill.jpg") },
  { id: 3, title: "Workout Mix", image: require("../assets/spotifyWorkout.jpg") },
  { id: 4, title: "Party Time", image: require("../assets/spotifyParty.jpg") },
];

type HomeScreenNav = NativeStackNavigationProp<RootStackParamList, "SpotifyHome">;

const SpotifyHome: React.FC = () => {
  const navigation = useNavigation<HomeScreenNav>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Good Evening 🎶</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigation.navigate("SpotifyProfile")}
          >
            <Text style={styles.navBtnText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigation.navigate("SpotifySettings")}
          >
            <Text style={styles.navBtnText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Playlists */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Your Playlists</Text>
        <View style={styles.playlistGrid}>
          {playlists.map((pl) => (
            <TouchableOpacity key={pl.id} style={styles.playlistCard}>
              <Image source={pl.image} style={styles.playlistImage} />
              <Text style={styles.playlistTitle}>{pl.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Mini Player */}
      <View style={styles.player}>
        <Image
          source={require("../assets/spotify.jpg")}
          style={styles.playerImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.songTitle}>Song Name</Text>
          <Text style={styles.songArtist}>Artist</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.playBtn}>▶️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SpotifyHome;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerButtons: { flexDirection: "row" },
  navBtn: {
    marginLeft: 10,
    backgroundColor: "#1DB954",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  navBtnText: { color: "#fff", fontWeight: "600" },
  scroll: { paddingHorizontal: 15, paddingBottom: 100 },
  sectionTitle: {
    color: "#1DB954",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  playlistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  playlistCard: {
    width: "48%",
    backgroundColor: "#111",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  playlistImage: { width: "100%", height: 120 },
  playlistTitle: {
    color: "#fff",
    padding: 10,
    fontWeight: "600",
    fontSize: 14,
  },
  player: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#222",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  playerImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  songTitle: { color: "#fff", fontWeight: "bold" },
  songArtist: { color: "#888", fontSize: 12 },
  playBtn: { fontSize: 28, color: "#1DB954", marginLeft: 10 },
});
