import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

// 🟢 Redux + Themes
import { useSelector } from "react-redux";
import { RootState } from "../src/store";
import { themes } from "../theme/themes";

// Mock playlists
const playlists = [
  { id: 1, title: "Top Hits", type: "music", image: require("../assets/spotifyTopHits.jpg") },
  { id: 2, title: "Chill Vibes", type: "music", image: require("../assets/spotifyChill.jpg") },
  { id: 3, title: "Workout Mix", type: "music", image: require("../assets/spotifyWorkout.jpg") },
  { id: 4, title: "Party Time", type: "music", image: require("../assets/spotifyParty.jpg") },
  { id: 5, title: "Daily News", type: "podcasts", image: require("../assets/spotifyPodcast1.jpg") },
  { id: 6, title: "Motivation Talks", type: "podcasts", image: require("../assets/spotifyPodcast2.jpg") },
  { id: 7, title: "Jazz Classics", type: "music", image: require("../assets/spotifyJazz.jpg") },
  { id: 8, title: "Indie Essentials", type: "music", image: require("../assets/spotifyIndie.jpg") },
];

type HomeScreenNav = NativeStackNavigationProp<RootStackParamList, "SpotifyHome">;

const SCREEN_WIDTH = Dimensions.get("window").width;

const SpotifyHome: React.FC = () => {
  const navigation = useNavigation<HomeScreenNav>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "music" | "podcasts">("all");
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  // 🟢 Get theme from Redux
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = themes[mode];

  const toggleDrawer = () => {
    if (drawerOpen) {
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(false));
    } else {
      setDrawerOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const filteredPlaylists =
    filter === "all" ? playlists : playlists.filter((pl) => pl.type === filter);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: theme.colors.primary }]}
          onPress={toggleDrawer}
        >
          <Text style={styles.navBtnText}>☰</Text>
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
          Good Evening 🎶
        </Text>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterRow}>
        {["all", "music", "podcasts"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              { backgroundColor: theme.colors.card },
              filter === f && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setFilter(f as "all" | "music" | "podcasts")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.colors.textSecondary },
                filter === f && { color: theme.colors.text },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PLAYLISTS */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.playlistGrid}>
          {filteredPlaylists.map((pl) => (
            <TouchableOpacity
              key={pl.id}
              style={[styles.playlistCard, { backgroundColor: theme.colors.card }]}
              onPress={() => navigation.navigate("Playlist", { playlist: pl })}
            >
              <Image source={pl.image} style={styles.playlistImage} />
              <Text style={[styles.playlistTitle, { color: theme.colors.text }]}>
                {pl.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* MINI PLAYER */}
      <View style={[styles.player, { backgroundColor: theme.colors.card }]}>
        <Image
          source={require("../assets/spotify.jpg")}
          style={styles.playerImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.songTitle, { color: theme.colors.text }]}>
            Song Name
          </Text>
          <Text style={[styles.songArtist, { color: theme.colors.textSecondary }]}>
            Artist
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.playBtn, { color: theme.colors.primary }]}>▶️</Text>
        </TouchableOpacity>
      </View>

      {/* BACKDROP */}
      {drawerOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleDrawer}
          activeOpacity={1}
        />
      )}

      {/* DRAWER */}
      <Animated.View
        style={[
          styles.drawer,
          { backgroundColor: theme.colors.card, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Image
            source={require("../assets/rin.jpg")}
            style={[styles.drawerProfilePic, { borderColor: theme.colors.primary }]}
          />
          <Text style={[styles.drawerName, { color: theme.colors.text }]}>
            Looweji
          </Text>
          <Text style={[styles.drawerSubtitle, { color: theme.colors.textSecondary }]}>
            Premium User
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("SpotifyProfile");
          }}
        >
          <Text style={styles.drawerIcon}>👤</Text>
          <Text style={[styles.drawerText, { color: theme.colors.text }]}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("SpotifySettings");
          }}
        >
          <Text style={styles.drawerIcon}>⚙️</Text>
          <Text style={[styles.drawerText, { color: theme.colors.text }]}>
            Settings
          </Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <TouchableOpacity
          style={[styles.drawerItem, { marginTop: "auto" }]}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("Spotify");
          }}
        >
          <Text style={styles.drawerIcon}>🚪</Text>
          <Text style={[styles.drawerText, { color: theme.colors.error }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SpotifyHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  navBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  navBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scroll: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  playlistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  playlistCard: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  playlistImage: {
    width: "100%",
    height: 120,
  },
  playlistTitle: {
    padding: 10,
    fontWeight: "600",
    fontSize: 14,
  },
  player: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  songTitle: {
    fontWeight: "bold",
  },
  songArtist: {
    fontSize: 12,
  },
  playBtn: {
    fontSize: 28,
    marginLeft: 10,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.7,
    padding: 20,
    zIndex: 10,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },
  drawerHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  drawerProfilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
  },
  drawerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerSubtitle: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  drawerIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  drawerText: {
    fontSize: 16,
  },
});
